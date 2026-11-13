// Features de animação carregadas sob demanda pelo <LazyMotion> da home.
// Mantidas em um módulo próprio para que o bundler gere um chunk separado
// e o bundle inicial inclua apenas o componente leve `m`.
import { domAnimation } from "motion/react";

export default domAnimation;
