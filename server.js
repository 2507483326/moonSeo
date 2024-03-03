import { LocalMoonSeo } from './seo/LocalMoonSeo.js';
import { ServerMoonSeo } from './seo/ServerMoonSeo.js';

const isProduction = process.env.NODE_ENV === 'production'
const moonSeo = isProduction ? new ServerMoonSeo() : new LocalMoonSeo()

moonSeo.start();