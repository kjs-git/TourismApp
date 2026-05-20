using Application.Authentication;
using Application.DTOs;

using Domain.Entities;
using Domain.Interfaces;


namespace Application.Services
{
    public class AuthService : IAuthService
    {
        private readonly IUserRepository _userRepository;
        private readonly IPasswordHasher _passwordHasher;
        private readonly IJwtProvider _jwtProvider;

        public AuthService(IUserRepository userRepository, IPasswordHasher passwordHasher, IJwtProvider jwtProvider)
        {
            _userRepository = userRepository;
            _passwordHasher = passwordHasher;
            _jwtProvider = jwtProvider;
        }

        public async Task<AuthResponse> RegisterAsync(RegisterRequest request)
        {
            var userExists = await _userRepository.ExistsByEmailAsync(request.Email);
            if (userExists)
            {
                throw new Exception("Пользователь с таким email уже существует");
            }

            var user = new User
            {
                Email = request.Email,
                FullName = request.FullName,
                Role = request.Role,
                PasswordHash = _passwordHasher.Generate(request.Password)
            };

            await _userRepository.AddAsync(user);

            return new AuthResponse { Message = "Успешная регистрация" };
        }

        public async Task<AuthResponse> LoginAsync(LoginRequest request)
        {
            var user = await _userRepository.GetByEmailAsync(request.Email);
            if (user == null)
            {
                throw new Exception("Неверный email или пароль");
            }

            var isPasswordValid = _passwordHasher.Verify(request.Password, user.PasswordHash);
            if (!isPasswordValid)
            {
                throw new Exception("Неверный email или пароль");
            }

            var token = _jwtProvider.GenerateToken(user);

            return new AuthResponse { Token = token, Message = "Успешный вход" };
        }
    }
}