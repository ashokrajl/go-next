import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import { ApolloClient, gql, InMemoryCache  } from '@apollo/client'
import "tailwindcss/tailwind.css";

// import Link from 'next/link'

export default function Home({data}) {
const player = useRef(null);

  const [isAudioLoaded, setAudioLoaded] = useState(false);

  const [shldPlay, setShldPlay] = useState('');

  useEffect(() => {
    const WaveSurfer = require("wavesurfer.js");
    const TimelinePlugin = require("wavesurfer.js/dist/plugin/wavesurfer.timeline.min.js")
    const RegionsPlugin = require("wavesurfer.js/dist/plugin/wavesurfer.regions.min.js")


    var wavesurfer = WaveSurfer.create({
      // your options here
      container: "#waveform",
      waveColor: 'rgb(200, 58, 34)',
      progressColor: 'rgb(252, 78, 54)',

      plugins: [
        TimelinePlugin.create({
            container: "#wave-timeline"
        }),
        RegionsPlugin.create({
          regionsMinLength: 2,
          regions: [
              {
                  start: 12.9,
                  end: 15, 
                  loop: false,
                  color: 'hsla(400, 100%, 30%, 0.5)'
              }, {
                  start: 5,
                  end: 7,
                  loop: false,
                  color: 'hsla(200, 50%, 70%, 0.4)',
                  minLength: 1,
              }
          ],
          dragSelection: {
              slop: 5
          },
      })
      ]
    });

    // var wavesurfer = WaveSurfer.create({
    //   container: "#waveform",
    //   waveColor: "violet",
    //   progressColor: "purple",
    //   plugins: [
    //     TimelinePlugin.create({
    //       container: "#waveform"
    //   })
    // ]
    // });
    wavesurfer.load(
      data.audio.file
    );
    wavesurfer.on("ready", function () {
      console.log("player is ",player.current);
      setAudioLoaded(true);
      TimelinePlugin.create({
        container: "#wave-timeline"
    })

    if(shldPlay){
    wavesurfer.play(1, 2);
      
    }
      // wavesurfer.play();
    });
  }, [shldPlay]);


  function play(){
    setShldPlay(true)

  }

  return (
    <div className="container">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="container mx-auto w-full p-2 rounded-lg">
      

        <div id="waveform"  className="bg-gray-100 width-10 mx-auto rounded-lg" ref={player}>loading...</div>
        <div id="wave-timeline">loading...</div>
        <button onClick={play}>play</button>
{JSON.stringify(data,null,4)}

      </main>
    </div>
  );
}


export async function getStaticProps(){
const client = new ApolloClient({
  uri: 'https://papercup-fake-server.vercel.app/api/demo',
  cache: new InMemoryCache()
});
interface test{
  
}
const {data} = await client.query({
  query: gql`{
    audio(id: "papercup") {
      file
      annotations {
        startTime
        endTime
      }
    }
  }
  `
})
  return {
    props:{data}
  }

}