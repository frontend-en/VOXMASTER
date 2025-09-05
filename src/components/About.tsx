import ExternalLink from "lucide-react/dist/esm/icons/external-link";
import Music from "lucide-react/dist/esm/icons/music";
import Play from "lucide-react/dist/esm/icons/play";
import CheckCircle from "lucide-react/dist/esm/icons/check-circle";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { poster, poster1 } from "../assets";
import { ImageCarousel } from "./ImageCarousel";

export function About() {
  const benefits = [
    "Пишу тексты и музыку, делаю аранжировки",
    "Делаю сведение и подбираю референсы под трек",
    "Подхожу рационально: без «магии», только то, что работает",
  ];

  const musicLinks = [
    {
      platform: "YouTube",
      url: "https://www.youtube.com/channel/UCy9gI1psMdd8YXBgjibqDFg",
      icon: Play,
    },
    {
      platform: "Яндекс Музыка",
      url: "https://music.yandex.ru/artist/6293883",
      icon: Music,
    },
    {
      platform: "Spotify",
      url: "https://open.spotify.com/artist/4aX01LqumAS6ImfPONFsUU",
      icon: Music,
    },
    {
      platform: "Apple Music",
      url: "https://music.apple.com/ru/artist/танцы-сознания/1441236784",
      icon: Music,
    },
    {
      platform: "vk",
      url: "https://vk.com/danceofmind",
      icon: Play,
    },
  ];

  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <h2 className="text-center mb-6 mx-auto">Ещё больше обо мне</h2>
          <p className="">
            Мы все устроены похоже: важнее понять, что и зачем мы делаем
            голосом. На уроках я снимаю «туман», помогаю убрать зажимы и
            формирую простые, безопасные мышечные привычки + понимание «что я
            делаю сейчас».
          </p>
          <p className="mt-4">
            Атмосфера — лёгкая и уважительная. Работаем на ваших треках, чтобы
            вы пели в нужном жанре и подстраивали тембр под задачу.
          </p>
          <p className="mt-4">
            Я действующий артист: пишу песни, выступаю и выпускаю музыку в
            проекте синтеза театра и музыки “Танцы Сознания” — остаюсь «в
            контексте» индустрии.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start grid-container">
          <div>
            <div className="mb-8">
              <div className="grid gap-4">
                {benefits.map((benefit, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg"
                  >
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8">
              <h4 className="mb-4">Музыкальные ссылки:</h4>
              <div className="flex flex-wrap gap-3">
                {musicLinks.map((link, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="justify-start"
                    asChild
                  >
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
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
              <CardContent className="p-0" style={{ paddingBottom: "0px" }}>
                <ImageCarousel
                  images={[
                    { src: poster, alt: "Вокальный коуч в действии" },
                    { src: poster1, alt: "Урок: разбор дыхания и опоры" },
                  ]}
                  autoPlayMs={4000} // можно поменять или убрать
                  rounded="rounded-lg" // совпадает с вашим стилем
                />
              </CardContent>
            </Card>

            <div className="absolute -bottom-6 -right-6 bg-primary text-primary-foreground p-4 rounded-lg shadow-lg">
              <div className="text-center">
                <div className="font-bold">10+</div>
                <div className="text-xs">лет опыта</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
