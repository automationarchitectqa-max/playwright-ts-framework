import { test } from '../../src/core/fixtures';
import { ApiAssertions } from '../../src/api/utils/api-assertions';
import { DataProvider } from '../../src/core/utils/data-provider';
import { TestHelper } from '../../src/helpers/test-helper';
import { ProductResponse } from '../../src/api/pojos/product-response.model';
import { ProductRequest } from '../../src/api/pojos/product-request.model';

const scenarios =
  DataProvider.getScenarios<any>(
    'products multiple.yaml',
    'createProduct'
  );


test.describe('@api Products API', () => {

  scenarios.forEach(
    (scenario) => {

      test(
        scenario.name,
        async ({
          apiClient,
        }, testInfo) => {

          const request =
            scenario.request as ProductRequest;

          const response =
            await apiClient.post<ProductResponse>(
              '/objects',
              request
            );

          await ApiAssertions.assertStatus(
            response,
            scenario.expected.statusCode
          );

          await ApiAssertions.assertOk(
            response
          );

          await ApiAssertions.assertValue(
            response.body.name,
            scenario.expected.body.name,
            'Validate product name'
          );

          await ApiAssertions.assertValue(
            response.body.data.year,
            scenario.expected.body.data.year,
            'Validate product year'
          );

          await ApiAssertions.assertValue(
            response.body.data.price,
            scenario.expected.body.data.price,
            'Validate product price'
          );

          await ApiAssertions.assertValue(
            response.body.data['CPU model'],
            scenario.expected.body.data['CPU model'],
            'Validate CPU model'
          );

          await ApiAssertions.assertValue(
            response.body.data['Hard disk size'],
            scenario.expected.body.data['Hard disk size'],
            'Validate hard disk size'
          );

          await ApiAssertions.assertTruthy(
            response.body.id,
            'Validate product id generated'
          );

          await ApiAssertions.assertTruthy(
            response.body.createdAt,
            'Validate createdAt generated'
          );

          await TestHelper.attachJson(
            testInfo,
            'Create Product Request',
            request
          );

          await TestHelper.attachJson(
            testInfo,
            'Create Product Response',
            response.body
          );
        }
      );

    }
  );

});