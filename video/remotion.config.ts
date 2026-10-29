import { Config } from "@remotion/cli/config";

// PNG evita artefactos de compresión en los fotogramas intermedios: el texto
// sale más nítido en el MP4 final.
Config.setVideoImageFormat("png");
Config.setOverwriteOutput(true);
