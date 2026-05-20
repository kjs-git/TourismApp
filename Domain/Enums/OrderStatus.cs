using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Enums
{
    public enum OrderStatus
    {
        Pending = 0,    // Ожидает подтверждения продавцом (гидом)
        Confirmed = 1,  // Подтвержден продавцом, ожидает оплаты от клиента
        Paid = 2,       // Успешно оплачен
        Cancelled = 3   // Отменен (продавцом или клиентом)
    }
}
