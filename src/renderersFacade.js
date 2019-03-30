import renderCascade from './renderCascade';
import plainRender from './renderPlain';

const renderMethods = {
  plain: plainRender,
  cascade: renderCascade,
};

export default (diff, format) => renderMethods[format](diff);
