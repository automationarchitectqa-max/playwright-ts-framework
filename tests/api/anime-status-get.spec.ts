import { test } from '../../src/core/fixtures';
import { ApiAssertions } from '../../src/api/utils/api-assertions';
import { DataProvider } from '../../src/core/utils/data-provider';
import { ReportHelper } from '../../src/core/utils/report-helper';
import { TestHelper } from '../../src/helpers/test-helper';
import { AnimeStatusResponse } from '../../src/api/pojos/anime-status.model';
// base url : https://abhi-api.vercel.app
test.describe.skip('@api @smoke Anime Status API', () => {

  test('GET /api/anime/astatus should return anime video URL', async ({
    apiClient,
  }, testInfo) => {

    const data =
      DataProvider.get<any>(
        testInfo,
        'anime-status.yaml',
        'getAnimeStatus'
      );

    const response =
      await apiClient.get<AnimeStatusResponse>(
        '/api/anime/astatus'
      );

    await ReportHelper.step(
      'Load expected values from anime-status.yaml'
    );
    await ApiAssertions.assertStatus(
      response,
      200
    );

    await ApiAssertions.assertOk(
      response
    );

    await ApiAssertions.assertFields(
      response.body,
      {
        code: data.expected.code,
        status: data.expected.status,
      }
    );

    await ApiAssertions.assertTruthy(
      response.body.creator,
      'Validate creator exists'
    );

    await ApiAssertions.assertContains(
      response.body.result,
      data.expected.resultContains,
      'Validate MP4 URL returned'
    );

    await TestHelper.attachJson(
      testInfo,
      'Anime Status Response',
      response.body
    );
  });

  test('GET test 2', async ({
    apiClient,
  }, testInfo) => {

    const data =
      DataProvider.get<any>(
        testInfo,
        'anime-status.yaml',
        'getAnimeStatus'
      );

    const response =
      await apiClient.get<AnimeStatusResponse>(
        '/api/anime/astatus'
      );

    await ReportHelper.step(
      'Load expected values from anime-status.yaml'
    );
    await ApiAssertions.assertStatus(
      response,
      201
    );

    await ApiAssertions.assertOk(
      response
    );

    await ApiAssertions.assertFields(
      response.body,
      {
        code: data.expected.code,
        status: data.expected.status,
      }
    );

    await ApiAssertions.assertTruthy(
      response.body.creator,
      'Validate creator exists'
    );

    await ApiAssertions.assertContains(
      response.body.result,
      data.expected.resultContains,
      'Validate MP4 URL returned'
    );

    await TestHelper.attachJson(
      testInfo,
      'Anime Status Response',
      response.body
    );
  });

});