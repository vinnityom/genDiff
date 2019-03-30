import jsonLikeRender from './render';
import plainRender from './renderPlain';

const renderMethods = {
  plain: plainRender,
  jsonLike: jsonLikeRender,
};

export default (diff, format) => renderMethods[format](diff);
