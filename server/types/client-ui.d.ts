// The server imports shared DTOs from the client entity folder, where a few
// browser-only interfaces reference Font Awesome. The server never consumes
// those icon fields, so keep its typecheck independent of the client install.
declare module "@fortawesome/free-solid-svg-icons" {
  export type IconDefinition = unknown;
}
