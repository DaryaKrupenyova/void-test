import { useState } from 'react'

interface Service {
  id: number
  name: string
  price: number
}

interface ServiceItem {
  service: Service
  quantity: number
}

const availableServices: Service[] = [
  { id: 1, name: 'Разработка лендинга', price: 50000 },
  { id: 2, name: 'Интернет-магазин', price: 150000 },
  { id: 3, name: 'Корпоративный портал', price: 300000 },
  { id: 4, name: 'SEO-оптимизация', price: 20000 },
]

export default function ProjectBuilder() {
  const [selectedServices, setSelectedServices] = useState<ServiceItem[]>([])
  const [selectedServiceId, setSelectedServiceId] = useState('')
  const [quantity, setQuantity] = useState(1)

  const totalPrice = selectedServices.reduce(
    (sum, item) => sum + item.service.price * item.quantity,
    0,
  )

  const quantityIsValid = Number.isInteger(quantity) && quantity >= 1 && quantity <= 10

  function addService() {
    if (selectedServiceId === '' || !quantityIsValid) return

    const service = availableServices.find((s) => s.id === Number(selectedServiceId))
    if (!service) return

    setSelectedServices((items) => {
      const exists = items.some((item) => item.service.id === service.id)

      if (!exists) {
        return [...items, { service, quantity }]
      }

      return items.map((item) =>
        item.service.id === service.id ? { ...item, quantity: item.quantity + quantity } : item,
      )
    })
  }

  function removeService(serviceId: number) {
    setSelectedServices((items) => items.filter((item) => item.service.id !== serviceId))
  }

  return (
    <div
      className="project-builder"
      style={{ maxWidth: 700, margin: '0 auto', fontFamily: 'sans-serif' }}
    >
      <h2>Состав проекта</h2>

      <div
        className="add-service"
        style={{ display: 'flex', gap: 12, marginBottom: 24, alignItems: 'center', flexWrap: 'wrap' }}
      >
        <select
          value={selectedServiceId}
          onChange={(e) => setSelectedServiceId(e.target.value)}
          style={{ padding: '8px 12px' }}
        >
          <option value="" disabled>
            Выберите услугу
          </option>
          {availableServices.map((service) => (
            <option key={service.id} value={service.id}>
              {service.name} — {service.price.toLocaleString('ru-RU')} ₽
            </option>
          ))}
        </select>

        <input
          type="number"
          min={1}
          max={10}
          step={1}
          value={Number.isNaN(quantity) ? '' : quantity}
          onChange={(e) => setQuantity(e.target.valueAsNumber)}
          style={{ width: 80, padding: '8px 12px' }}
        />

        <button
          type="button"
          onClick={addService}
          disabled={selectedServiceId === '' || !quantityIsValid}
          style={{ padding: '8px 14px' }}
        >
          Добавить
        </button>
      </div>

      {selectedServices.length > 0 ? (
        <table className="services-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #ddd', padding: 10, textAlign: 'left' }}>Услуга</th>
              <th style={{ border: '1px solid #ddd', padding: 10, textAlign: 'left' }}>
                Цена за ед.
              </th>
              <th style={{ border: '1px solid #ddd', padding: 10, textAlign: 'left' }}>Кол-во</th>
              <th style={{ border: '1px solid #ddd', padding: 10, textAlign: 'left' }}>Сумма</th>
              <th style={{ border: '1px solid #ddd', padding: 10 }} />
            </tr>
          </thead>
          <tbody>
            {selectedServices.map((item) => (
              <tr key={item.service.id}>
                <td style={{ border: '1px solid #ddd', padding: 10 }}>{item.service.name}</td>
                <td style={{ border: '1px solid #ddd', padding: 10 }}>
                  {item.service.price.toLocaleString('ru-RU')} ₽
                </td>
                <td style={{ border: '1px solid #ddd', padding: 10 }}>{item.quantity}</td>
                <td style={{ border: '1px solid #ddd', padding: 10 }}>
                  {(item.service.price * item.quantity).toLocaleString('ru-RU')} ₽
                </td>
                <td style={{ border: '1px solid #ddd', padding: 10 }}>
                  <button type="button" onClick={() => removeService(item.service.id)}>
                    Удалить
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={3} style={{ border: '1px solid #ddd', padding: 10 }}>
                <strong>Итого:</strong>
              </td>
              <td colSpan={2} style={{ border: '1px solid #ddd', padding: 10 }}>
                <strong>{totalPrice.toLocaleString('ru-RU')} ₽</strong>
              </td>
            </tr>
          </tfoot>
        </table>
      ) : (
        <p style={{ color: '#888', fontStyle: 'italic' }}>Пока не добавлено ни одной услуги</p>
      )}
    </div>
  )
}
