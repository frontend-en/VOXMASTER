import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Check, CreditCard, HelpCircle } from 'lucide-react';
import { PaymentModal } from './PaymentModal';

export function Pricing() {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<{
    title: string;
    price: string;
  } | null>(null);

  const handlePaymentClick = (planTitle: string, planPrice: string) => {
    setSelectedPlan({ title: planTitle, price: planPrice });
    setIsPaymentModalOpen(true);
  };
  return (
    <section className="py-8 px-4 md:py-8 lg:py-8" style={{
      paddingTop: 'calc(var(--header-height-mobile) + 24px)',
    }}>
      <div className="max-w-6xl mx-auto pricing-section">
        {/* Кикер и заголовок */}
        <div className="text-center mb-8 md:mb-12">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-muted text-muted-foreground text-sm font-medium mb-4">
            Тарифы
          </div>
          <h2 className="mb-4">Три направления — одна цена</h2>
          <p className="text-lg text-muted-foreground max-w-4xl mx-auto">
            Любой формат занятия — 3000 ₽, ≈40–50 минут, индивидуально, онлайн (Microsoft Teams). 
            Слот 45 минут — с буфером на вопросы. Переносы — по договоренности, предупредите за 24 часа.
          </p>
        </div>
        
        {/* Сетка карточек */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 mb-12">
          {/* Карточка 1 - Урок вокала (Рекомендация) */}
          <Card className="relative h-full border-2 border-primary rounded-[18px] shadow-lg">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-primary text-primary-foreground">Рекомендация</Badge>
            </div>
            <CardHeader className="pt-6">
              <CardTitle>Урок вокала</CardTitle>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold">3000 ₽</span>
              </div>
              <p className="text-sm text-muted-foreground">≈40–50 мин • индивидуально • онлайн</p>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="mb-4">
                <h4 className="text-sm font-medium mb-3 text-foreground">Что входит:</h4>
                <ul className="space-y-2.5">
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">Индивидуальная диагностика и постановка целей</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">Подбор упражнений и ясный план между уроками</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">Разбор фраз/песен под вашу задачу (запись/сцена/жанр)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">Техники для самостоятельной практики — безопасно и без перегруза</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">Короткая «сверка» вопросов в начале следующего занятия</span>
                  </li>
                </ul>
              </div>
              <p className="text-xs text-muted-foreground italic">
                Запись — по желанию ученика (на своей стороне).
              </p>
            </CardContent>
            <CardFooter className="flex flex-col gap-3">
              <div className="flex flex-col gap-3 w-full">
                <Button 
                  className="w-full min-h-[44px]"
                  onClick={() => handlePaymentClick('Урок вокала', '3000 ₽')}
                >
                  <CreditCard className="mr-2 h-4 w-4" />
                  Оплатить урок
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full min-h-[44px]"
                  onClick={() => {
                    document.getElementById('book')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  <HelpCircle className="mr-2 h-4 w-4" />
                  Спросить об оплате
                </Button>
              </div>
            </CardFooter>
          </Card>

          {/* Карточка 2 - Урок сонграйтинга */}
          <Card className="relative h-full border border-border rounded-[18px]">
            <CardHeader>
              <CardTitle>Урок сонграйтинга</CardTitle>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold">3000 ₽</span>
              </div>
              <p className="text-sm text-muted-foreground">≈40–50 мин • трек-ориентированно</p>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="mb-4">
                <h4 className="text-sm font-medium mb-3 text-foreground">Что входит:</h4>
                <ul className="space-y-2.5">
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">Аранжировка. Учим собирать трек: выбор инструментов, ритм-секция, интро/дроп/бридж, динамика по куплетам/припевам.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">Музыкальное мышление. Что «работает», что нет и почему: рефлексы уха, контрасты, плотность, экономия идей. Прививаем привычки, чтобы «писалось проще».</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">Тексты. Смысл → хук → слог. Как чистить клише, делать рифмы по смыслу, держать ритм фразы.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">Сведение (база). Громкости, панорама, эквалайзер/компрессия «на пальцах». Как сделать демо, которое не стыдно показать.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">Структура и драматургия. Формы куплет–припев–бридж, где развивать, где экономить, как не «устать» к середине.</span>
                  </li>
                </ul>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-3">
              <div className="flex flex-col gap-3 w-full">
                <Button 
                  className="w-full min-h-[44px]"
                  onClick={() => handlePaymentClick('Урок сонграйтинга', '3000 ₽')}
                >
                  <CreditCard className="mr-2 h-4 w-4" />
                  Оплатить урок
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full min-h-[44px]"
                  onClick={() => {
                    document.getElementById('book')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  <HelpCircle className="mr-2 h-4 w-4" />
                  Спросить об оплате
                </Button>
              </div>
            </CardFooter>
          </Card>

          {/* Карточка 3 - Урок прикладной теории */}
          <Card className="relative h-full border border-border rounded-[18px] md:col-span-2 lg:col-span-1">
            <CardHeader>
              <CardTitle>Урок прикладной теории</CardTitle>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold">3000 ₽</span>
              </div>
              <p className="text-sm text-muted-foreground">≈40–50 мин • ухо, ритм, гармония — на практике</p>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="mb-4">
                <h4 className="text-sm font-medium mb-3 text-foreground">Что входит:</h4>
                <ul className="space-y-2.5">
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">Сольфеджио — уверенно попадать в ноты и подбирать мелодии на слух.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">Ритм — развитие чувства ритма, применение на практике в музыке и вокале.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">Теория в действии — быстро понимать, какие аккорды и ноты «работают» и почему.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">Гармония и функции — строить понятные ходы без тыканья на удачу.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">Подбор по слуху и разбор референсов — экономить часы, забирать принципы, а не копировать.</span>
                  </li>
                </ul>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-3">
              <div className="flex flex-col gap-3 w-full">
                <Button 
                  className="w-full min-h-[44px]"
                  onClick={() => handlePaymentClick('Урок прикладной теории', '3000 ₽')}
                >
                  <CreditCard className="mr-2 h-4 w-4" />
                  Оплатить урок
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full min-h-[44px]"
                  onClick={() => {
                    document.getElementById('book')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  <HelpCircle className="mr-2 h-4 w-4" />
                  Спросить об оплате
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>

        {/* Примечания */}
        <div className="bg-muted/20 rounded-lg p-4 md:p-6 mb-8 md:mb-12 border border-border/50">
          <h4 className="font-medium mb-3 text-foreground">Примечания:</h4>
          <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
            <p>
              Мы не режем урок по таймеру: длительность зависит от задачи и усвоения материала. Иногда хватает 30 минут, иногда сидим 1–1,5 часа; в среднем выходит 40–50 минут. В расписании стоит слот 45 минут, чтобы оставался буфер на вопросы.
            </p>
            <p>
              Оплата по карте/СБП, чек — автоматически на e-mail/мессенджер.
            </p>
          </div>
        </div>

        {/* Блок с пакетами */}
        <div className="bg-muted/30 rounded-[18px] p-4 sm:p-6 md:p-8">
          <div className="text-center mb-6 md:mb-8">
            <h3 className="mb-3 md:mb-4 mx-auto">Пакеты для спокойного прогресса</h3>
            <p className="text-muted-foreground max-w-3xl mx-auto px-2 sm:px-0">
              Та же методика и внимание 1:1. Выбирайте темп, в котором комфортно заниматься. Переносы — по договорённости (сообщить за 24 часа).
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 max-w-5xl mx-auto">
            {/* Карточка 4 занятия */}
            <div className="bg-background rounded-[18px] p-4 sm:p-5 md:p-6 border border-border shadow-sm">
              <div className="mb-4 sm:mb-5">
                <h4 className="mb-2">4 занятия</h4>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-xl sm:text-2xl font-bold">11 000 ₽</span>
                  <span className="text-xs sm:text-sm text-muted-foreground">экономия 1 000 ₽</span>
                </div>
                <p className="text-sm text-muted-foreground">Спокойный старт на месяц</p>
              </div>
              
              <div className="mb-5 sm:mb-6">
                <h5 className="text-sm font-medium mb-3 text-foreground">Что получите:</h5>
                <ul className="space-y-2 sm:space-y-2.5">
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">Индивидуальные уроки онлайн (≈40–50 мин)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">План между занятиями и «сверка» в начале следующего</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">Можно комбинировать: вокал / сонграйтинг / теория</span>
                  </li>
                </ul>
              </div>
              
              <div className="flex flex-col gap-2.5 sm:gap-3">
                <Button 
                  className="w-full min-h-[44px]"
                  onClick={() => handlePaymentClick('4 занятия', '11 000 ₽')}
                >
                  <CreditCard className="mr-2 h-4 w-4" />
                  <span className="sm:hidden">Выбрать 4</span>
                  <span className="hidden sm:inline">Выбрать 4 занятия</span>
                </Button>
                <Button 
                  variant="outline"
                  className="w-full min-h-[44px]"
                  onClick={() => {
                    document.getElementById('book')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  <HelpCircle className="mr-2 h-4 w-4" />
                  <span className="sm:hidden">Записаться</span>
                  <span className="hidden sm:inline">Записаться без оплаты</span>
                </Button>
              </div>
            </div>
            
            {/* Карточка 8 занятий */}
            <div className="bg-background rounded-[18px] p-4 sm:p-5 md:p-6 border border-border shadow-sm">
              <div className="mb-4 sm:mb-5">
                <h4 className="mb-2">8 занятий</h4>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-xl sm:text-2xl font-bold">21 000 ₽</span>
                  <span className="text-xs sm:text-sm text-muted-foreground">экономия 3 000 ₽</span>
                </div>
                <p className="text-sm text-muted-foreground">Оптимально, если хотите регулярность 1–2 раза в неделю</p>
              </div>
              
              <div className="mb-5 sm:mb-6">
                <h5 className="text-sm font-medium mb-3 text-foreground">Что получите:</h5>
                <ul className="space-y-2 sm:space-y-2.5">
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">Те же индивидуальные уроки онлайн (≈40–50 мин)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">Более заметная динамика за счёт регулярности</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">Можно комбинировать направления под цель</span>
                  </li>
                </ul>
              </div>
              
              <div className="flex flex-col gap-2.5 sm:gap-3">
                <Button 
                  className="w-full min-h-[44px]"
                  onClick={() => handlePaymentClick('8 занятий', '21 000 ₽')}
                >
                  <CreditCard className="mr-2 h-4 w-4" />
                  <span className="sm:hidden">Выбрать 8</span>
                  <span className="hidden sm:inline">Выбрать 8 занятий</span>
                </Button>
                <Button 
                  variant="outline"
                  className="w-full min-h-[44px]"
                  onClick={() => {
                    document.getElementById('book')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  <HelpCircle className="mr-2 h-4 w-4" />
                  <span className="sm:hidden">Записаться</span>
                  <span className="hidden sm:inline">Записаться без оплаты</span>
                </Button>
              </div>
            </div>
          </div>
          
          <div className="mt-6 sm:mt-8 text-center px-2 sm:px-0">
            <p className="text-sm text-muted-foreground max-w-3xl mx-auto">
              Пакеты можно комбинировать: вокал/сонграйтинг/теория в любом соотношении. Срок действия — 60 дней.<br className="hidden sm:block" />
              <span className="sm:hidden"> </span>Не спешите: можно начать с одного урока — пакеты оформить позже.
            </p>
          </div>
        </div>
      </div>

      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        planTitle={selectedPlan?.title}
        planPrice={selectedPlan?.price}
      />
    </section>
  );
}