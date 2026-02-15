import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AddressInput from '../../components/AddressInput';
import { VEHICLE_TYPES, CARGO_TYPES } from '../../utils/calculator';

const STEPS = ['Маршрут', 'Груз', 'Детали', 'Оплата', 'Подтверждение'];

export default function OrderWizard() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    from: null, to: null,
    cargoType: '', cargoDesc: '', weight: '', volume: '', places: '1',
    vehicleType: 'tent',
    contactFrom: '', phoneFrom: '', contactTo: '', phoneTo: '',
    pickupDate: '', pickupTime: '09:00',
    payment: 'card',
    insurance: false, loading: false,
    agreed: false,
  });
  const [submitted, setSubmitted] = useState(false);

  const update = (key, val) => setForm(prev => ({ ...prev, [key]: val }));
  const canNext = () => {
    if (step === 0) return form.from && form.to;
    if (step === 1) return form.cargoType && form.weight;
    if (step === 2) return form.contactFrom && form.phoneFrom;
    if (step === 3) return form.payment;
    if (step === 4) return form.agreed;
    return true;
  };

  const submit = () => {
    setSubmitted(true);
    setTimeout(() => navigate('/client/orders'), 3000);
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Заказ оформлен!</h2>
        <p className="text-sm text-gray-500 text-center mb-2">Номер заказа: <span className="font-bold text-primary">TRN-006</span></p>
        <p className="text-xs text-gray-400 text-center">Мы найдём водителя и свяжемся с вами</p>
        <div className="mt-6 w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fade-in">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Новый заказ</h2>

      {/* Progress */}
      <div className="flex items-center gap-1">
        {STEPS.map((s, i) => (
          <div key={s} className="flex-1 flex flex-col items-center">
            <div className={`w-full h-1.5 rounded-full mb-1 ${i <= step ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'}`} />
            <span className={`text-[10px] ${i <= step ? 'text-primary font-medium' : 'text-gray-400'}`}>{s}</span>
          </div>
        ))}
      </div>

      {/* Step 0: Route */}
      {step === 0 && (
        <div className="card p-4 space-y-3 animate-slide-up">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Маршрут перевозки</h3>
          <AddressInput label="Откуда (погрузка)" value={form.from} onChange={v => update('from', v)} color="#1A73E8" />
          <AddressInput label="Куда (выгрузка)" value={form.to} onChange={v => update('to', v)} color="#00C853" />
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Дата погрузки</label>
              <input type="date" value={form.pickupDate} onChange={e => update('pickupDate', e.target.value)} className="input-field" />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Время</label>
              <input type="time" value={form.pickupTime} onChange={e => update('pickupTime', e.target.value)} className="input-field" />
            </div>
          </div>
        </div>
      )}

      {/* Step 1: Cargo */}
      {step === 1 && (
        <div className="card p-4 space-y-3 animate-slide-up">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Информация о грузе</h3>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Тип груза</label>
            <select value={form.cargoType} onChange={e => update('cargoType', e.target.value)} className="input-field">
              <option value="">Выберите тип груза</option>
              {CARGO_TYPES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Описание груза</label>
            <textarea value={form.cargoDesc} onChange={e => update('cargoDesc', e.target.value)} rows={2} className="input-field" placeholder="Опишите груз подробнее..." />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Вес, т</label>
              <input type="number" value={form.weight} onChange={e => update('weight', e.target.value)} className="input-field" placeholder="0" />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Объём, м³</label>
              <input type="number" value={form.volume} onChange={e => update('volume', e.target.value)} className="input-field" placeholder="0" />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Мест</label>
              <input type="number" value={form.places} onChange={e => update('places', e.target.value)} className="input-field" />
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-2 block">Тип транспорта</label>
            <div className="grid grid-cols-4 gap-2">
              {VEHICLE_TYPES.slice(0, 8).map(v => (
                <button key={v.id} onClick={() => update('vehicleType', v.id)}
                  className={`py-2 px-1 rounded-xl text-center text-xs transition-all ${form.vehicleType === v.id ? 'bg-primary text-white shadow-lg' : 'bg-gray-50 dark:bg-gray-800 text-gray-600'}`}>
                  <div className="font-medium leading-tight">{v.name}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Contacts */}
      {step === 2 && (
        <div className="card p-4 space-y-4 animate-slide-up">
          <div>
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Контакт на погрузке</h3>
            <div className="space-y-3">
              <input value={form.contactFrom} onChange={e => update('contactFrom', e.target.value)} className="input-field" placeholder="ФИО" />
              <input value={form.phoneFrom} onChange={e => update('phoneFrom', e.target.value)} className="input-field" placeholder="+7 (___) ___-__-__" />
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Контакт на выгрузке</h3>
            <div className="space-y-3">
              <input value={form.contactTo} onChange={e => update('contactTo', e.target.value)} className="input-field" placeholder="ФИО" />
              <input value={form.phoneTo} onChange={e => update('phoneTo', e.target.value)} className="input-field" placeholder="+7 (___) ___-__-__" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl cursor-pointer">
              <input type="checkbox" checked={form.insurance} onChange={e => update('insurance', e.target.checked)} className="w-5 h-5 rounded text-primary" />
              <div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">Страхование груза</div>
                <div className="text-xs text-gray-500">0.5% от стоимости груза</div>
              </div>
            </label>
            <label className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl cursor-pointer">
              <input type="checkbox" checked={form.loading} onChange={e => update('loading', e.target.checked)} className="w-5 h-5 rounded text-primary" />
              <div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">Погрузка / разгрузка</div>
                <div className="text-xs text-gray-500">5 000 ₽</div>
              </div>
            </label>
          </div>
        </div>
      )}

      {/* Step 3: Payment */}
      {step === 3 && (
        <div className="card p-4 space-y-3 animate-slide-up">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Способ оплаты</h3>
          {[
            { id: 'card', name: 'Банковская карта', desc: 'Visa, MasterCard, МИР' },
            { id: 'invoice', name: 'По счёту', desc: 'Для юридических лиц' },
            { id: 'cash', name: 'Наличные водителю', desc: 'При получении' },
            { id: 'cod', name: 'Наложенный платёж', desc: 'Оплата при доставке' },
          ].map(p => (
            <button key={p.id} onClick={() => update('payment', p.id)}
              className={`w-full flex items-center gap-3 p-4 rounded-xl transition-all ${form.payment === p.id ? 'bg-primary/10 border-2 border-primary' : 'bg-gray-50 dark:bg-gray-800 border-2 border-transparent'}`}>
              <div className="text-left">
                <div className="text-sm font-medium text-gray-900 dark:text-white">{p.name}</div>
                <div className="text-xs text-gray-500">{p.desc}</div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Step 4: Confirmation */}
      {step === 4 && (
        <div className="card p-4 space-y-4 animate-slide-up">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Подтверждение</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
              <span className="text-gray-500">Откуда</span>
              <span className="text-gray-900 dark:text-white font-medium">{form.from?.name}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
              <span className="text-gray-500">Куда</span>
              <span className="text-gray-900 dark:text-white font-medium">{form.to?.name}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
              <span className="text-gray-500">Груз</span>
              <span className="text-gray-900 dark:text-white font-medium">{form.cargoType}, {form.weight} т</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
              <span className="text-gray-500">Транспорт</span>
              <span className="text-gray-900 dark:text-white font-medium">{VEHICLE_TYPES.find(v => v.id === form.vehicleType)?.name}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
              <span className="text-gray-500">Оплата</span>
              <span className="text-gray-900 dark:text-white font-medium">{form.payment === 'card' ? 'Картой' : form.payment === 'invoice' ? 'По счёту' : form.payment === 'cash' ? 'Наличные' : 'Наложенный платёж'}</span>
            </div>
          </div>
          <label className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl cursor-pointer">
            <input type="checkbox" checked={form.agreed} onChange={e => update('agreed', e.target.checked)} className="w-5 h-5 rounded text-primary" />
            <span className="text-sm text-gray-700 dark:text-gray-300">Согласен с <span className="text-primary underline">условиями перевозки</span> и <span className="text-primary underline">политикой конфиденциальности</span></span>
          </label>
        </div>
      )}

      {/* Navigation buttons */}
      <div className="flex gap-3">
        {step > 0 && (
          <button onClick={() => setStep(step - 1)} className="btn-outline flex-1">← Назад</button>
        )}
        {step < STEPS.length - 1 ? (
          <button onClick={() => setStep(step + 1)} disabled={!canNext()} className="btn-primary flex-1">
            Далее →
          </button>
        ) : (
          <button onClick={submit} disabled={!form.agreed} className="btn-accent flex-1">
            Оформить заказ
          </button>
        )}
      </div>
    </div>
  );
}
