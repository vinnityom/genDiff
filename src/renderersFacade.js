import renderCascade from './renderers/renderCascade';
import plainRender from './renderers/renderPlain';

const renderMethods = {
  plain: plainRender,
  cascade: renderCascade,
};

export default (diff, format) => renderMethods[format](diff);
