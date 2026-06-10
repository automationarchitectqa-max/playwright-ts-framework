export class CurlLogger {

  static log(
    method: string,
    url: string,
    headers: Record<string, string>,
    body?: object
  ): void {

    const curlParts = [
      `curl --location --request ${method.toUpperCase()} '${url}'`
    ];

    Object.entries(headers).forEach(
      ([key, value]) => {

        curlParts.push(
          `--header '${key}: ${value}'`
        );

      }
    );

    if (body) {

      curlParts.push(
        `--data '${JSON.stringify(body)}'`
      );

    }

    console.log('\n================ CURL ================');
    console.log(curlParts.join(' \\\n'));
    console.log('======================================\n');
  }
}