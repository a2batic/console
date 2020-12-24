import { commonFlows } from '../views/common';
import { checkErrors } from '../../../integration-tests-cypress/support';

describe('Test KMS configuration for Internal mode', () => {
  before(() => {
    cy.login();
    cy.visit('/');
    commonFlows.navigateToOCS();
    cy.byLegacyTestID('horizontal-link-Storage Cluster').click();
    cy.byTestID('item-create').click();
    cy.byTestID('Internal-radio-input').click();
  });

  afterEach(() => {
    checkErrors();
  });

  after(() => {
    cy.logout();
  });

  it('Check for kms to be configured on storage cluster', () => {
    // to make a kms config using view and verify storage cluster yaml to have kms : enable { true };
  });
});
