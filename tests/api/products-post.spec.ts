import { test } from '../../src/core/fixtures';
import { ApiAssertions } from '../../src/api/utils/api-assertions';
import { DataProvider } from '../../src/core/utils/data-provider';
import { TestHelper } from '../../src/helpers/test-helper';
import { ProductRequest } from '../../src/api/pojos/product-request.model';
import { ProductResponse } from '../../src/api/pojos/product-response.model';

test.describe('@api Products API', () => {

  test('POST /objects should create product', async ({apiClient}, testInfo) => {

    const data =
      DataProvider.get<any>(
        testInfo,
        'products.yaml',
        'createProduct'
      );

    const request =
      data.request as ProductRequest;
    console.log('Request:', request);

    const response =
      await apiClient.post<ProductResponse>(
        '/objects',
        request
      );
   
    await ApiAssertions.assertStatus(
      response,
      data.expected.statusCode
    );

    await ApiAssertions.assertOk(
      response
    );

    await ApiAssertions.assertValue(
      response.body.name,
      data.expected.body.name,
      'Validate product name'
    );

    await ApiAssertions.assertValue(
      response.body.data.year,
      data.expected.body.data.year,
      'Validate product year'
    );

    await ApiAssertions.assertValue(
      response.body.data.price,
      data.expected.body.data.price,
      'Validate product price'
    );

    await ApiAssertions.assertValue(
      response.body.data['CPU model'],
      data.expected.body.data['CPU model'],
      'Validate CPU model'
    );

    await ApiAssertions.assertValue(
      response.body.data['Hard disk size'],
      data.expected.body.data['Hard disk size'],
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
  });

});