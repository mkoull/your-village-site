import { services } from "../../../content/services";
import { existingSupport } from "../../../content/existing-support";

export { services };
export const slugs = services.map((service) => service.slug);
export const providers = existingSupport;
export const serviceFor = (slug: string) =>
  services.find((service) => service.slug === slug);
export const providerFor = (slug: string) =>
  providers.find((provider) => provider.serviceSlug === slug);
