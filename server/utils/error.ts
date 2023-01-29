export function logError(e: unknown) {
  if (e instanceof Error) {
    console.log(e.message, e.stack);
  } else {
    console.log(JSON.stringify(e));
  }
}
