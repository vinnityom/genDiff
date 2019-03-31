import renderCascade from './renderCascade';
import plainRender from './renderPlain';
import renderJSON from './renderJSON';

const renderMethods = {
  plain: plainRender,
  cascade: renderCascade,
  json: renderJSON,
};

export default (diff, format) => renderMethods[format](diff);
