import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import runPostbuild from "./postbuild.js";

export default () => {

  return defineConfig({
    base: './',
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

