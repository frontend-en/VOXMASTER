import { useEffect, useRef, useState, KeyboardEvent } from "react";
import { Card, CardContent } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";
import {
  Star,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export function Testimonials() {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [forceUpdate, setForceUpdate] = useState(0);
  const pauseTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  // Состояние для отслеживания развернутых комментариев
  const [expandedComments, setExpandedComments] = useState<Set<number>>(
    new Set()
  );

  const testimonials = [
    {
      name: "Максим",
      date: "18 нояб. 2024, 19:18",
      text: "С Вадимом занимаюсь уже второй месяц, раз в неделю. Пришел к нему не совсем с нуля а уже занимался вокалом около года (с перерывам)и с другим преподавателем. Пока мой фидбэк положительный, мне нравится что Вадим достаточно внимательно слушает и уже дал мне несколько полезных советов и подметил какие-то вещи на которые раньше не обращал внимания. Первые несколько занятий Вадим больше определял мой уровень и смотрел что получается делать с голосом а что нет, и мне понравилось что он не стал зацикливаться на каких-то базовых упражнениях и техниках когда понял что у меня получается их делать и я в целом их понимаю и мы перешли дальше заниматься уже каким-то конкретным песнями и работой над тембром при следующих занятиях. В общем нравится что обучение происходит не просто по методичке а есть уникальный подход к ученику и его ситуации и уровню. Планирую продолжать заниматься",
      rating: 5,
    },
    {
      name: "Михаил",
      date: "15 мар. 2025, 02:25",
      text: 'Мы прошли с Вадимом несколько уроков, и на каждом я смог подчеркнуть для себя что-то новое и полезное: на первом - раскрепощение и общие вводные, цели, понятие о том, что есть вокал и куда там нажимать и что получим на выходе, и где находимся сейчас (а я ведь и не знал толком); на послежующих - конкретика (про гортани, полости и так далее), с индивидуальным подходом по итогам первого урока; на следующих - углубляем и добавляем. Всё в индивидуальном темпе, понятно, легко. Иногда спрашиваю по-з@#*отски про детали по музыкальным понятиям - с удовольствием углубляемся чуть в теорию. Общение всегда живое, всегда абсолютно раскрепощенное. Всё с примерами. Итог: прекрасный компетентный преподаватель, четко чувствует что нужно ученику, подстраивается "на лету", оказывет постоянную поддержку. Рад что к нему попал!',
      rating: 5,
    },
    {
      name: "Владимир",
      date: "24 февр. 2025, 13:24",
      text: 'В настоящее время крайне тяжело найти толкового преподавателя, способного не только развеять мифы о том, "как надо", но и не навязать своих. Именно Вадим помог мне разобраться что есть "нормально", а что нет. Благодаря ему прогресс сдвинулся с мертвой точки. Не грузит излишней теорией, делает упор на практику, имеет структурированный и индивидуальный подход к каждому ученику, записывая их особенности, проблемы и т.п. Крайне рекомендую!',
      rating: 5,
    },
    {
      name: "Ефрем",
      date: "20 окт. 2024, 04:44",
      text: "Периодически обращаюсь за консультациями к преподавателям школы, после случайной личной встречи решил взять пару уроков у Вадима. На занятии все происходит четко и по делу. Есть конкретный запрос или нет, время в любом случае будет проведено с пользой. Лично для меня самым важным было отрезвление касательно оценки самого себя, своих навыков, планов и способ их реализации. Преподаватель отличный, все круто.",
      rating: 5,
    },
    {
      name: "Сергей",
      date: "24 авг. 2024, 16:58",
      text: "Чувствуется опыт и профессионализм Вадима. На первой занятии он попросил спеть, я не собрался и промазал мимо всех нот, но он как полагается прогнал меня по разным упражнениям и мгновенно оценил реальный уровень и указал, что нужно подкачать, чем мы теперь и занимаемся. Четко, компетентно, респект.",
      rating: 5,
    },
    {
      name: "Рамиль",
      date: "30 июля 2023, 12:50",
      text: "Занимаюсь вокалом у Вадима и очень этим доволен! Крайне профессиональный преподаватель, объясняет все просто и доходчиво. Видно, что на каждом уроке Вадим сильно заинтересован в том, чтобы ты понял весь материал и извлек как можно больше пользы из занятия. Вся информация подается с позитивом и на понятных для тебя примерах. За пару занятий узнал очень много нового и полезного для себя, уже слышу прогресс) Спасибо Вадиму за его труд!",
      rating: 5,
    },
    {
      name: "Дима",
      date: "28 янв. 2022, 13:08",
      text: "Занимаюсь с Вадимом больше месяца. Выбрал его, посмотрев стрим-урок, понравились его понятные объяснения и легкость общения. На уроках дает решение по какой-нибудь проблеме, что даже не возникает никаких вопросов.",
      rating: 5,
    },
    {
      name: "Тиль",
      date: "21 янв. 2025, 15:54",
      text: "Занимаюсь у этого преподавателя не так давно, объясняется все понятно, без воды и с индивидуальным подходом, атмосфера на занятиях свободная, занятия проходят легко, всегда отвечает развернуто на вопросы, мне нравится в общем, буду продолжать.",
      rating: 5,
    },
    {
      name: "Макс",
      date: "11 дек. 2021, 13:13",
      text: "Занимаюсь с Вадимом чуть больше двух месяцев и могу с полной уверенностью сказать, что под руководством знающего человека в вокале можно достичь больших успехов. И, как ни странно, Вадим как раз таки такой человек ). На первом же занятии я понял над чем мне стоит работать, чтобы дальше развиваться в вокальном плане. И, конечно же, не могу не сказать, что на занятиях я получаю ответы на все интересующие меня вопросы. Преподаватель всегда объясняет(и показывает), как извлечь определенный звук, или как к нему прийти. Также стоит отметить, что занятия проходят в очень дружелюбной форме, так что про стеснительность и зажатость можно забыть. В общем круто все. Собираюсь дальше обучаться у него и, конечно же, советую вам поступить так же )",
      rating: 5,
    },
    {
      name: "Игорь",
      date: "4 дек. 2021, 15:00",
      text: "Крутой преподаватель, на данный момент отзанимались 4 урока и в планах продолжать. На начальных уроках дает детальную информацию (но без воды), слушает и самое главное круто анализирует ученика, что говорит о хорошем багаже опыта и ответственной работе. Терпеливо выслушивает вопросы и дает полный раскрытый ответ на понятном языке. Отлично подойдет как преподаватель ученикам, которые нацелены на крутой результат во всех аспектах, построении качественной вокальной базы и проработки конкретных тем.",
      rating: 5,
    },
    {
      name: "Nick",
      date: "22 нояб. 2024, 17:17",
      text: "Хороший преподователь, занимался с ним всего-то раз, но мне понравилось, шутит и дает нужную информацию, ответил на все мои вопрос, которые интересовали и дал хороший фитбэк, так что смело идите к этому хорошему человеку, еще он очень круто поет, мне нравится его вокал он очень интересен, так что рекомендую!!!!",
      rating: 5,
    },
    {
      name: "Евгений",
      date: "21 нояб. 2021, 12:51",
      text: "Видно, что человек предан своему делу и мастерски управляет своим голосом, из-за чего доверия больше и соответственно есть желание прислушиваться и учиться у него. Первый урок понравился, меня прослушали в разных манерах и определили что конкретно нужно подтянуть и в каком направлении двигаться. Рекомендую!",
      rating: 5,
    },
    {
      name: "Татьяна",
      date: "2 окт. 2021, 15:58",
      text: "Очень хороший преподаватель. Прекрасно разбирается в строении голосового аппарата, материал подаёт ёмко, доступно, с юмором и отсылками) Занятия проходят в лёгкой, дружественной атмосфере, что сильно помогает побороть зажатость. Все упражнения разбираются максимально подробно, с разных сторон. Если что-то не получается поймать сразу, Вадим обязательно найдёт подходящее объяснение, которое наконец раскроет тайну неподдающихся мистических звуков. К концу занятия точно понимаешь, куда далее следует двигаться и какими тропами.",
      rating: 5,
    },
    {
      name: "Михаил",
      date: "7 сент. 2021, 16:18",
      text: "Вадим хорошо понимает физиологию и анатомию всего вокального аппарата и на основе этого очень доступно объясняет принципы его работы. В результате нескольких занятий мною достигнуто понимание различных приемов звукоизвлечения и даны различные упражнения для совершенствования их. Занятия проходят хорошо, учитель к себе очень располагает!",
      rating: 5,
    },
    {
      name: "Игорь",
      date: "7 сент. 2021, 12:53",
      text: 'После года очных занятий с преподавателем из своего города понял, что не до конца понимаю базовые принципы работы своего голосового аппарата. Вспомнив про школу Джона решил записаться к Вадиму на занятия и ничуть не пожалел. Объяснив свою ситуацию мы начали постепенно, шаг за шагом, разбираться с устройством голосового аппарата, без каких-либо "почувствуй свою 3 чакру" и прочей белиберды, а исключительно с физиологической точки зрения (это, в общем-то, то, зачем я сюда и пришёл). Позанимавшись месяц понял, что год до этого занимался не совсем тем, что было необходимо на самом деле. И если бы всё это время я учился петь с Вадимом, то достиг гораздо больших результатов нежели имею на сегодняшний день. Всем рекомендую!',
      rating: 5,
    },
    {
      name: "Максим",
      date: "4 сент. 2021, 15:28",
      text: "Взял первый свой урок (онлайн раньше не занимался вообще) у Вадима, не пожалел ни разу, очень позитивный человек, объяснил вещи, которые за полгода на сцене мне объяснить не смогли 😅, уже на второй день после занятия, раз 5 выполнив упражнения, заметил огромный шаг вперёд, то ли ещё будет 😅 Если бы знал, что всё будет настолько хорошо, давным давно записался бы, не повторяйте моих ошибок, не сомневайтесь на пути к целям и мечтам 😁",
      rating: 5,
    },
    {
      name: "Евгений",
      date: "3 сент. 2021, 09:28",
      text: "Отличный препод! Просто, подробно и логично рассказал про звукоизвлечение. Объясняет интересно, последовательно и структурированно. Для любого звука даёт физиологическое обоснование, как он таким становится. После занятий реально стало понятно, как голос работает и как им управлять. Уроки проходят в дружеской атмосфере. Рекомендую!",
      rating: 5,
    },
    {
      name: "Валерий",
      date: "30 авг. 2021, 23:22",
      text: "Вадим классный препод , уроки были интересные и понятные, в ходе занятий я узнал несколько важных приемов и фишек, рекомендую)",
      rating: 5,
    },
    {
      name: "Nik",
      date: "30 авг. 2021, 18:03",
      text: "Решил попробовать онлайн занятия, после 2х месяцев занятий в офлайне. За первые пару занятий узнал больше, чем за 2 месяца. Очень доволен, препод объясняет все на понятном языке, с юморком.",
      rating: 5,
    },
    {
      name: "Илья",
      date: "25 авг. 2021, 22:44",
      text: "Очень структурировано объясняет, все раскладывает по полочкам, приятный в общении.",
      rating: 5,
    },
    {
      name: "Александр",
      date: "25 авг. 2021, 22:13",
      text: "Отличный преподаватель-общительный и весёлый. Кроме того очень доходчиво и интересно объясняет материал. Всем советую)",
      rating: 5,
    },
    {
      name: "Никита",
      date: "21 авг. 2021, 13:51",
      text: "Отличный препод , обьясняет понятно , рассказывает интересно , рекомендую)",
      rating: 5,
    },
    {
      name: "Данил",
      date: "3 авг. 2021, 20:15",
      text: "Абсолютно доволен занятиями и результатами. Пришёл с задачей постановки голоса, уже после первого занятия начал понимать, как и над чем нужно работать, спустя еще пару закрыл все базовые вопросы. Также обучение проходит в дружеской атмосфере, нет ощущения нудного изучения тем, как и нет душных упражнений.",
      rating: 5,
    },
    {
      name: "Максим",
      date: "3 авг. 2021, 16:00",
      text: "Классный преподаватель. Объясняет материал классно, доходчиво. Всегда поможет и подскажет, если есть какие-то вопросы и проблемы. Занимаюсь только пару месяцев, пока всем доволен и планирую продолжать.",
      rating: 5,
    },
    {
      name: "Никита",
      date: "11 июня 2021, 14:27",
      text: "Довольно понимающий, весёлый и душевный преподаватель. Помогает осваивать сложный материал через юмор, что в свою очередь снимает напряженную атмосферу и скованность. За 4 занятия узнал огромное количество информации, вокальное мастерство поднялось не на одну, а на 2-3 ступени. Вадим часто делится своим личным опытом и помогает чувствовать себя комфортно и уютно. Ни разу не пожалел о своём выборе!",
      rating: 5,
    },
    {
      name: "Александр",
      date: "10 июня 2025, 19:00",
      text: "Хороший преподаватель и приятный в общении человек. Расскажет вам о том, как устроен ваш голосовой аппарат, и конечно же научит вас им управлять",
      rating: 5,
    },
  ];

  // Получаем viewport элемент
  const getScrollArea = () => {
    return scrollAreaRef.current?.querySelector(
      "[data-radix-scroll-area-viewport]"
    ) as HTMLDivElement;
  };

  // Вычисляем актуальную ширину карточки с промежутком для экстра широких карточек
  const getCardWidth = () => {
    const scrollArea = getScrollArea();
    if (!scrollArea) {
      // Адаптивные fallback значения для экстра широких карточек
      if (window.innerWidth < 640) return Math.max(350, window.innerWidth - 16); // Mobile: минимум 350px
      if (window.innerWidth < 768) return 674; // 650px + 24px gap
      if (window.innerWidth < 1024) return 704; // 680px + 24px gap
      if (window.innerWidth < 1280) return 744; // 720px + 24px gap
      if (window.innerWidth < 1440) return 774; // 750px + 24px gap
      return 774; // 750px + 24px gap для больших экранов
    }

    const cards = scrollArea.querySelectorAll("[data-card]");
    if (cards.length > 1) {
      const firstCard = cards[0] as HTMLElement;
      const secondCard = cards[1] as HTMLElement;
      return secondCard.offsetLeft - firstCard.offsetLeft;
    }

    // Fallback с адаптивностью
    if (window.innerWidth < 640) return Math.max(350, window.innerWidth - 16);
    if (window.innerWidth < 768) return 674;
    if (window.innerWidth < 1024) return 704;
    if (window.innerWidth < 1280) return 744;
    if (window.innerWidth < 1440) return 774;
    return 774;
  };

  // Общее количество страниц для экстра широких карточек
  const getTotalPages = () => {
    const scrollArea = getScrollArea();
    const totalCards = testimonials.length;

    if (!scrollArea) {
      // Fallback в зависимости от размера экрана для экстра широких карточек
      if (window.innerWidth < 640) return totalCards; // Mobile: по 1 карточке
      if (window.innerWidth < 768) return Math.max(1, totalCards); // Tablet: 1.2 карточки
      if (window.innerWidth < 1024) return Math.max(1, totalCards); // Desktop: 1.3 карточки
      if (window.innerWidth < 1280) return Math.max(1, totalCards); // Large: 1.4 карточки
      if (window.innerWidth < 1440) return Math.max(1, totalCards); // XL: 1.6 карточки
      return Math.max(1, totalCards); // Ultra: 1.8 карточки
    }

    const containerWidth = scrollArea.clientWidth;
    const cardWidth = getCardWidth();

    if (cardWidth === 0 || containerWidth === 0) {
      return Math.max(1, totalCards);
    }

    // Вычисляем точное количество видимых карточек
    const exactVisibleCards = containerWidth / cardWidth;

    // Mobile: если помещается менее 1.05 карточек, показываем по одной
    if (exactVisibleCards < 1.05) {
      return totalCards;
    }

    // Для экстра широких карточек: обычно показываем только 1 полную карточку плюс часть следующей
    const fullyVisibleCards = Math.floor(exactVisibleCards);
    const pages = Math.max(1, totalCards - fullyVisibleCards + 1);

    // Ограничиваем максимальное количество страниц
    return Math.min(pages, totalCards);
  };

  const [totalPages, setTotalPages] = useState(1); // Инициализируем с 1

  // Функция для перехода к определенной странице
  const goToSlide = (pageIndex: number) => {
    const scrollArea = getScrollArea();
    const currentTotalPages = getTotalPages();
    if (!scrollArea || pageIndex < 0 || pageIndex >= currentTotalPages) return;

    // Очищаем предыдущий таймаут
    if (pauseTimeoutRef.current) {
      clearTimeout(pauseTimeoutRef.current);
    }

    resetExpandedState();
    setIsPaused(true); // как было
    setActiveSlide(pageIndex);

    // Ставим автопрокрутку на паузу
    setIsPaused(true);

    // Мгновенно обновляем состояние для UI
    setActiveSlide(pageIndex);

    const cardWidth = getCardWidth();

    // Для 1.5 карточек: каждый шаг = ширина одной карточки
    const targetPosition = pageIndex * cardWidth;
    const maxScrollLeft = scrollArea.scrollWidth - scrollArea.clientWidth;
    const newPosition = Math.min(targetPosition, maxScrollLeft);

    resetExpandedState();

    scrollArea.scrollTo({
      left: newPosition,
      behavior: "smooth",
    });

    // Возобновляем автопрокрутку через 6 секунд после клика
    pauseTimeoutRef.current = setTimeout(() => {
      setIsPaused(false);
    }, 7000);
  };

  const resetCardHeights = () => {
    const scrollArea = getScrollArea();
    if (!scrollArea) return;
    const cards = scrollArea.querySelectorAll<HTMLElement>("[data-card]");
    cards.forEach((card) => {
      card.style.height = "";
      card.style.maxHeight = "";
      card.removeAttribute("data-expanded");
    });
  };

  // Унифицированный сброс «разворотов» + высот
  const resetExpandedState = () => {
    setExpandedComments(new Set()); // свернуть все отзывы
    resetCardHeights(); // очистить инлайновые размеры
  };

  // Обновляем активную страницу при изменении позиции скролла
  const updateActiveSlide = (scrollLeft: number) => {
    if (isPaused) return;

    const cardWidth = getCardWidth();
    const currentTotalPages = getTotalPages();
    const currentPage = Math.round(scrollLeft / cardWidth);
    const newActiveSlide = Math.max(
      0,
      Math.min(currentPage, currentTotalPages - 1)
    );

    if (newActiveSlide !== activeSlide) {
      // СБРОС при смене страницы вручную
      resetExpandedState();
      setActiveSlide(newActiveSlide);
    }
  };

  // Автопрокрутка
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      const scrollArea = getScrollArea();
      if (!scrollArea) return;

      const cardWidth = getCardWidth();
      const currentTotalPages = getTotalPages();
      const maxScrollLeft = scrollArea.scrollWidth - scrollArea.clientWidth;

      if (currentTotalPages !== totalPages) {
        setTotalPages(currentTotalPages);
      }

      const nextPageIndex = (activeSlide + 1) % currentTotalPages;
      const nextPosition = nextPageIndex * cardWidth;
      const newPosition = nextPosition >= maxScrollLeft ? 0 : nextPosition;

      // СБРОС перед перелистыванием
      resetExpandedState();

      scrollArea.scrollTo({ left: newPosition, behavior: "smooth" });
      setActiveSlide(nextPageIndex);
    }, 4000); // Прокрутка каждые 4 секунды

    return () => clearInterval(interval);
  }, [isPaused, activeSlide, totalPages]);

  // Добавляем слушатель скролла для отслеживания ручной прокрутки
  useEffect(() => {
    const scrollArea = getScrollArea();
    if (!scrollArea) return;

    let scrollTimeout: NodeJS.Timeout;

    const handleScroll = () => {
      // Очищаем предыдущий таймаут
      clearTimeout(scrollTimeout);

      // Обновляем активный слайд с небольшой задержкой
      scrollTimeout = setTimeout(() => {
        const scrollLeft = scrollArea.scrollLeft;
        updateActiveSlide(scrollLeft);
      }, 100);
    };

    scrollArea.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      scrollArea.removeEventListener("scroll", handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, [activeSlide, isPaused]);

  // Отслеживание изменений размера окна
  useEffect(() => {
    const handleResize = () => {
      // Небольшая задержка для завершения изменения размеров
      setTimeout(() => {
        const newTotalPages = getTotalPages();

        // Обновляем количество страниц
        setTotalPages(newTotalPages);

        // Сбрасываем активный слайд если он больше не валидный
        if (activeSlide >= newTotalPages) {
          setActiveSlide(0);
        }

        // Принудительно обновляем для перерендера UI и пересчета needsExpansion
        setForceUpdate((prev) => prev + 1);
      }, 100);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [activeSlide]);

  // Инициализация и обновление количества страниц при монтировании
  useEffect(() => {
    // Небольшая задержка для полной загрузки компонентов
    const timer = setTimeout(() => {
      const newTotalPages = getTotalPages();
      setTotalPages(newTotalPages);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Обновление totalPages при forceUpdate
  useEffect(() => {
    const newTotalPages = getTotalPages();
    if (newTotalPages !== totalPages) {
      setTotalPages(newTotalPages);
    }
  }, [forceUpdate]);

  // Очистка таймаутов при размонтировании
  useEffect(() => {
    return () => {
      if (pauseTimeoutRef.current) {
        clearTimeout(pauseTimeoutRef.current);
      }
    };
  }, []);

  // Обработчик клавиатурной навигации
  const handleKeyDown = (event: KeyboardEvent, slideIndex: number) => {
    const currentTotalPages = getTotalPages();

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      goToSlide(slideIndex);
    }

    // Навигация стрелками
    if (event.key === "ArrowLeft" && slideIndex > 0) {
      event.preventDefault();
      goToSlide(slideIndex - 1);
    }

    if (event.key === "ArrowRight" && slideIndex < currentTotalPages - 1) {
      event.preventDefault();
      goToSlide(slideIndex + 1);
    }
  };

  // Обработчики для паузы при наведении
  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => setIsPaused(false);

  // Функция для переключения состояния развернутого комментария
  const toggleComment = (index: number) => {
    setExpandedComments((prev) => {
      const newSet = new Set(prev);
      const wasExpanded = newSet.has(index);
      const scrollArea = getScrollArea();
      const card =
        scrollArea?.querySelectorAll<HTMLElement>("[data-card]")?.[index];
      if (card) {
        if (wasExpanded) {
          card.removeAttribute("data-expanded");
          card.style.maxHeight = ""; // если анимировали
        } else {
          card.setAttribute("data-expanded", "true");
          card.style.maxHeight = ""; // анимация «до auto» — если используете
        }
      }
      if (wasExpanded) newSet.delete(index);
      else newSet.add(index);
      return newSet;
    });
  };

  // Функция для определения, нужна ли кнопка "показать больше"
  const needsExpansion = (text: string) => {
    // Учитываем размер экрана для более точного определения
    const lineClampLines = 4; // Количество строк в line-clamp-4

    // Адаптивное количество символов в зависимости от размера экрана
    let charsPerLine = 60; // Desktop default
    if (typeof window !== "undefined") {
      if (window.innerWidth < 480) {
        charsPerLine = 30; // Очень маленькие экраны
      } else if (window.innerWidth < 640) {
        charsPerLine = 35; // Мобильные
      } else if (window.innerWidth < 768) {
        charsPerLine = 40; // Большие мобильные
      } else if (window.innerWidth < 1024) {
        charsPerLine = 45; // Планшеты
      } else if (window.innerWidth < 1280) {
        charsPerLine = 55; // Маленькие desktop
      }
    }

    const maxCharsInCollapsed = charsPerLine * lineClampLines;
    return text.length > maxCharsInCollapsed;
  };

  // ниже остальных хуков
  const handlePrev = () => {
    const pages = getTotalPages();
    const prev = (activeSlide - 1 + pages) % pages;
    goToSlide(prev);
  };

  const handleNext = () => {
    const pages = getTotalPages();
    const next = (activeSlide + 1) % pages;
    goToSlide(next);
  };

  return (
    <section className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="mb-4 mx-auto">Отзывы учеников</h2>
          <p className="text-muted-foreground mx-auto">
            Что говорят о занятиях мои ученики
          </p>
        </div>

        <div
          ref={scrollAreaRef}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="testimonials-container mx-auto px-2" // Адаптивная ширина для экстра широких карточек
        >
          <ScrollArea className="w-full">
            <div className="flex space-x-6 pb-4">
              {testimonials.map((testimonial, index) => (
                <Card
                  key={index}
                  data-card
                  className="testimonial-card flex-shrink-0"
                >
                  <CardContent className="p-8 sm:p-9 md:p-10 testimonial-card-content">
                    <div className="flex items-center gap-1.5 mb-5">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="h-6 w-6 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                    </div>

                    <div className="testimonial-text">
                      <div className="mb-6 ml-2">
                        <p
                          className={`text-base text-sm lg:text-lg leading-relaxed ${
                            expandedComments.has(index) ? "" : "line-clamp-4"
                          }`}
                        >
                          {testimonial.text}
                        </p>

                        {/* Кнопка показать больше/меньше */}

                        {needsExpansion(testimonial.text) && (
                          <button
                            onClick={() => toggleComment(index)}
                            className="testimonial-expand-btn mt-3 text-sm text-primary hover:text-primary/80 focus:text-primary/80 transition-colors duration-200 flex items-center gap-2 group !mx-3"
                            aria-expanded={expandedComments.has(index)}
                            aria-label={
                              expandedComments.has(index)
                                ? "Скрыть полный текст отзыва"
                                : "Показать полный текст отзыва"
                            }
                          >
                            {expandedComments.has(index) ? (
                              <>
                                Показать меньше
                                <ChevronUp className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5" />
                              </>
                            ) : (
                              <>
                                Показать больше
                                <ChevronDown className="h-4 w-4 transition-transform duration-200 group-hover:translate-y-0.5" />
                              </>
                            )}
                          </button>
                        )}
                      </div>

                      <div className="flex justify-between items-center text-sm lg:text-lg  text-muted-foreground mt-auto pt-5 border-t border-border/30">
                        <span>{testimonial.name}</span>
                        <span>{testimonial.date}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Навигация стрелками снизу */}
        {totalPages > 1 && (
          <div className="mt-8 sm:mt-12 flex justify-center">
            <div
              className="inline-flex items-center gap-3"
              role="group"
              aria-label="Навигация отзывов"
            >
              <button
                type="button"
                onClick={handlePrev}
                onKeyDown={(e) => {
                  if (e.key === "ArrowLeft") {
                    e.preventDefault();
                    handlePrev();
                  }
                  if (e.key === "ArrowRight") {
                    e.preventDefault();
                    handleNext();
                  }
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handlePrev();
                  }
                }}
                className="
          h-11 px-4 rounded-full border border-border/60 bg-background/70
          hover:bg-accent hover:text-accent-foreground
          focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background
          active:scale-95 transition
        "
                aria-label="Предыдущий отзыв"
              >
                <span className="sr-only">Назад</span>
                <ChevronLeft className="w-5 h-5" aria-hidden="true" />
              </button>

              <button
                type="button"
                onClick={handleNext}
                onKeyDown={(e) => {
                  if (e.key === "ArrowRight") {
                    e.preventDefault();
                    handleNext();
                  }
                  if (e.key === "ArrowLeft") {
                    e.preventDefault();
                    handlePrev();
                  }
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleNext();
                  }
                }}
                className="
          h-11 px-4 rounded-full border border-border/60 bg-background/70
          hover:bg-accent hover:text-accent-foreground
          focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background
          active:scale-95 transition
        "
                aria-label="Следующий отзыв"
              >
                <span className="sr-only">Вперёд</span>
                <ChevronRight className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
