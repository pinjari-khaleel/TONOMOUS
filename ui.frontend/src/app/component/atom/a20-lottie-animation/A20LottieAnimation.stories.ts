import { A20LottieAnimationProps } from './A20LottieAnimation.types';

export default {
  title: 'NEOM/atom/A20 Lottie animation',
  component: require('./A20LottieAnimation'),
  argTypes: {
    jsonFilePath: {
      control: { type: 'text' },
      description: 'Set the path to the json file',
    },
    assetsFolderPath: {
      control: { type: 'text' },
      description: 'Set the path to the assets folder',
    },
    loop: {
      control: { type: 'boolean' },
      description: 'To loop the animation or not',
    },
    autoplay: {
      control: { type: 'boolean' },
      description: 'To autoplay the animation or not',
    },
    alt: {
      control: { type: 'text' },
      description: 'Add an alt for the animation',
    },
  },
  parameters: {
    docs: {
      description: {
        component: 'Renders a Lottie animation',
      },
    },
  },
};

export const Default = () => ({
  template: `<hbs>
        {{> a20-lottie-animation @root }}
    </hbs>`,
});

const defaultProps: A20LottieAnimationProps = {
  jsonFilePath: './json/c19-map/neom_staticHTML_map_FHD_en.json',
  assetsFolderPath: './image/c19-map/neom_staticHTML_map_FHD_en/',
  alt: 'Neom map test mobile',
  loop: true,
  autoplay: true,
};

Default.args = defaultProps;
