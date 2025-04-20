// https://stackoverflow.com/questions/951021/what-is-the-javascript-version-of-sleep
export async function waitFor(timeoutMs: number) {
	await new Promise((resolve) => setTimeout(resolve, timeoutMs));
}
