<template>
  <div>
    <section class="hero is-dark">
      <div class="hero-body">
        <div class="container">
          <div class="columns">
            <div class="column is-6 is-offset-3">
              <h1 class="title is-1">
                <b-icon icon="leaf"></b-icon>
                Sustentabilidad de KodaDot
              </h1>
              <h1 class="subtitle">
                micro-dao-bedrock-bootstrap-experimento
              </h1>
              <p>
                Como parte de nuestro micro-dao-bootstrap-experimento, nos gustaría mantener nuestros esfuerzos sostenibles <b>en el largo plazo y crear esa confianza de la cultura </b> y la economía de los creadores para KodaDot y darles esa seguridad de que no desapareceremos mañana y seguiremos funcionando mientras podamos cubrir nuestros esfuerzos para mantenerlo en línea y funcionando.
              </p><br>
              <p>
                Estaremos elaborando lentamente lo que es la mejor posible opcion para apoyar a la economia de los Creadores y ayudarles a realizar una vida sostenible de su trabajo. <b>Estamos aqui para apoyar esta causa.</b> Por otra parte, debemos tener en cuenta nuestra sostenibilidad a largo plazo. Estamos en posición de ser espectadores universales y de no ser propietarios de una plataforma como actualmente lo hacen otras galerias.
              </p><br>
              <p>
                Por el momento nuestro unico ingreso ha sido aprobado
                <a href="https://kusama.polkassembly.io/motion/256">propuesta#384 &amp;
                motion#256 de Kusama Treasury funding</a>
                por milestone1. Principalmente este fondo se destinó a los costos del desarrollo y no para su funcionamiento y/o mantenimiento.
              </p><br>
              <p>
                Nuestro flujo de los fondos estará dividio en 3 partes: <b>Un programa para el apoyo de los Artistas, Costos de funcionamiento y para el Costo de la investigacion y desarrollo de KodaDot.</b> Desde el inicio, vamos a poner una parte de nuestros ahorros en el fondo de bedrock.
              </p><br>
              <p>
                <a href="https://github.com/kodadot/nft-gallery/issues/141">
                Los costos por el funcionamento de</a> de KodaDot consisten en pagar Netlify (http, cdn, CI&amp;CD), Pinata (IPFS), Arweave (por ahora es gratuito, despues tendremos que pagar), Textile.io (esperamos que este costo sea el mismo por un tiempo, y despues aumente).
                Mantenimiento, los costos de R&amp;D deben ser pagados a
                <a href="https://github.com/kodadot/nft-gallery/issues">our backlog of
                 medida que nuevas funciones en KodaDot vayan apareciendo</a> y estamos  <b>tratando de invitar a mas desarrolladores a nuestros circulos poniendo recompensas en problemas</b>.
                Cualquiera podrá unirse y ayudar con nuestro esfuerzo.
              </p><br>
              <p>
                Como nos gustaría establecer nuestro vector de acumulación para el fondo de sostenibilidad e introducir  <b>una pequeña tarifa gracias a que podra mintear su obra</b> a través de KodaDot, agregaremos un botón en el que aún puede optar por no participar voluntariamente y poder mintear su obra sin apoyarnos en lo absoluto.
              </p><br>
              <p>
                Para <b>devolver valor a la comunidad</b>, estamos a punto de establecer
                <b><a href="https://hackmd.io/cy3jpAhvR-S32SUiMqEabg?edit">un programa para el apoyo a los artistas </a></b> el cual fluirá de regreso a los artistas. Estamos tratando de crear un ciclo de acumulacion de autorefuerzo, donde usted, como creador que apoya la galería de KodaDot, el apoyo regresará y será destinado a nuevos artistas, creando así efectos de red para los primeros usuarios y la próxima ola de adoptantes, etc., Que luego podrían ser autopropulsados en algún momento si logramos desarrollar la estategia correcta.  Solo necesitamos jugar un poco más con las curvas de flujo correctas.  Es un experimento.
              </p><br>
              <p>
                Los poseedores actuales de multisig son los fundadores de KodaDot --
                <a href="https://twitter.com/yangwao">yangwao</a> &amp;
                <a href="https://twitter.com/vikiival">vikiival</a>
                y luego se expandirá, ya que creemos confianza con una comunidad mas amplia a la que le gustaria participar y adentrarse en KodaDot ya que esperamos que la tesoreria pueda crecer ampliamente algun dia.
              </p><br>
              <h1 class="title is-4">
                <a href="https://dictionary.reverso.net/spanish-definition/sustentabilidad">Definicion de Sustentabilidad</a>
              </h1>
              <h1 class="subtitle">sustantivo</h1>
              <ul>
                <li>Es la abilidad de sostener o apoyar.</li>
                <li>Ciencia Ambiental. Es la cualidad de no ser dañino al Ambiente o estar agotando los recursos naturales por lo tanto se estaria apoyando el balance ecologico a una visión a largo plazo.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>

  </div>
</template>
<script lang="ts" >
import { Component, Vue } from 'vue-property-decorator'


@Component<EsSustainibility>({
  metaInfo() {
    return {
      meta: [
        { property: 'og:title', content: 'KodaDot Kusama NFT explorer'},
        { property: 'og:image', content: 'https://nft.kodadot.xyz/kodadot_carbonless.jpg'},
        { property: 'og:description', content: 'KodaDot: Sustainibility mission'},
        { property: 'twitter:title', content: 'Low minting fees and carbonless NFTs'},
        { property: 'twitter:description', content: 'KodaDot: Sustainibility mission'},
        { property: 'twitter:image', content: 'https://nft.kodadot.xyz/kodadot_carbonless.jpg'},
      ]
    }
  }
})
export default class EsSustainibility extends Vue {

}
</script>
