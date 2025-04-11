import type { CallLog, RouteMatcher } from 'fetch-mock';

export function createRouteMatcher(
	expectedUrl: string,
	expectedMethod: string,
	expectedContentType?: string,
	expectedBody?: string
): RouteMatcher {
	// https://www.wheresrhys.co.uk/fetch-mock/docs/#examples
	return function (log: CallLog) {
		if (log.url !== expectedUrl) {
			return false;
		}
		if (!log.options) {
			return false;
		}

		if (log.options.method !== expectedMethod) {
			return false;
		}

		if (expectedContentType) {
			if (!log.options.headers) {
				return false;
			}

			if (
				!Object.entries(log.options.headers).some(
					([header, value]) => header === 'content-type' && value === expectedContentType
				)
			) {
				return false;
			}
		}

		if (!expectedBody) {
			return true;
		}

		return expectedBody === log.options.body;
	};
}
