import { defineConfig,loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import runPostbuild from "./postbuild.js";

export default ({ mode }) => {

  const env = Object.assign(process.env, loadEnv(mode, process.cwd(), ''));

  return defineConfig({
    base: env.VITE_APP_URL,
    plugins: [
      react(),
      {
        name: 'postbuild-commands', // the name of your custom plugin. Could be anything.
        closeBundle: async () => {
          runPostbuild()
        }
      },

    ],
    build: {
      outDir: 'build'
    },
  })
}

