import { CheckCircle, ExternalLink } from "lucide-react";
import { poster, poster1 } from "../assets";
import { benefits, musicLinks } from "../lib/consts";
import { ImageCarousel, type Slide } from "./ImageCarousel";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";

const ABOUT_COPY = {
  heading: "Ещё больше обо мне",
  paragraphs: [
    "Мы все устроены похоже: важнее понять, что и зачем мы делаем голосом. На уроках я снимаю «туман», помогаю убрать зажимы и формирую простые, безопасные мышечные привычки + понимание «что я делаю сейчас».",
    "Атмосфера — лёгкая и уважительная. Работаем на ваших треках, чтобы вы пели в нужном жанре и подстраивали тембр под задачу.",
    "Я действующий артист: пишу песни, выступаю и выпускаю музыку в проекте синтеза театра и музыки “Танцы Сознания” — остаюсь «в контексте» индустрии.",
  ],
  musicHeading: "Музыкальные ссылки:",
  experience: {
    value: "10+",
    label: "лет опыта",
  },
} as const;

const ABOUT_CAROUSEL_IMAGES: Slide[] = [
  { src: poster, alt: "Вокальный коуч в действии" },
  { src: poster1, alt: "Урок: разбор дыхания и опоры" },
];

export function About() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <h2 className="text-center mb-6 mx-auto">{ABOUT_COPY.heading}</h2>
          {ABOUT_COPY.paragraphs.map((paragraph, index) => (
            <p key={paragraph} className={index === 0 ? undefined : "mt-4"}>
              {paragraph}
            </p>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start grid-container">
          <div>
            <div className="mb-8">
              <div className="grid gap-4">
                {benefits.map((benefit) => (
                  <div
                    key={benefit}
                    className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg"
                  >
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8">
              <h4 className="mb-4">{ABOUT_COPY.musicHeading}</h4>
              <div className="flex flex-wrap gap-3">
                {musicLinks.map((link) => (
                  <Button key={link.platform} variant="outline" className="justify-start" asChild>
                    <a href={link.url} target="_blank" rel="noopener noreferrer">
                      <link.icon className="mr-2 h-4 w-4" />
                      {link.platform}
                      <ExternalLink className="ml-2 h-3 w-3" />
                    </a>
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <div className="relative">
            <Card>
              <CardContent className="p-0">
                <ImageCarousel
                  images={ABOUT_CAROUSEL_IMAGES}
                  autoPlayMs={4000}
                  rounded="rounded-lg"
                />
              </CardContent>
            </Card>

            <div className="absolute -bottom-6 -right-6 bg-primary text-primary-foreground p-4 rounded-lg shadow-lg">
              <div className="text-center">
                <div className="font-bold">{ABOUT_COPY.experience.value}</div>
                <div className="text-xs">{ABOUT_COPY.experience.label}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
