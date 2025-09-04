import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from './ui/accordion';

export function FAQ() {
  const faqs = [
    {
      question: "Онлайн так же эффективно, как офлайн?",
      answer: "Да. Это удобно физически и психологически: вы дома, экономите время на дорогу, качество связи и звука — отличное."
    },
    {
      question: "Где проходят занятия?",
      answer: "В Microsoft Teams — стабильное видео и хороший звук. Ссылка приходит перед уроком, установка — в пару кликов."
    },
    {
      question: "Что нужно для занятия?",
      answer: "Ничего студийного. Достаточно нормального интернета, наушников и микрофона (подойдут и от телефона). С этого начинаем; дальше при желании подскажу, что улучшить."
    },
    {
      question: "Могу ли я записывать урок?",
      answer: "Да. Запись делает ученик у себя (например, OBS). Со стороны преподавателя запись не обязательна."
    },
    {
      question: "Можно ли платить пакетами?",
      answer: "Да, доступны пакеты на 4 и 8 занятий со скидкой. Срок действия — 60 дней."
    }
  ];

  return (
    <section className="py-20 px-4 bg-muted/50">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="mb-4 mx-auto">Частые вопросы</h2>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}