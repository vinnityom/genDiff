import renderCascade from './renderers/renderCascade';
import plainRender from './renderers/renderPlain';
import renderJSON from './renderers/renderJSON';

const renderMethods = {
  plain: plainRender,
  cascade: renderCascade,
  json: renderJSON,
};

export default (diff, format) => renderMethods[format](diff);
