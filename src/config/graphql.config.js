require("dotenv").config();

const privateEnable = process.env.GRAPHQL_PRIVATE_ENABLE || 'ENABLE';
const privateLandingPageEnable = process.env.GRAPHQL_PRIVATE_LANDING_PAGE_ENABLE || 'ENABLE';


const graphqlConfig = {
  port : process.env.GRAPHQL_PORT || '40001', 
  private_enable : privateEnable.toLowerCase() == 'enable',
  private_path : process.env.GRAPHQL_PRIVATE_PATH || '/gql',
  private_landing_page_enable : privateLandingPageEnable.toLowerCase() == 'enable',
};

module.exports = graphqlConfig;
