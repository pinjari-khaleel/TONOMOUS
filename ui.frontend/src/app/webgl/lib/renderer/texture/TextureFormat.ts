import LogGL from '../core/LogGL';
import GL from '../base/GL';
import Renderer from '../render/Renderer';
import GL2 from '../base/GL2';

export default class TextureFormat {
  public static ALPHA_UNSIGNED_BYTE: string = 'ALPHA UNSIGNED_BYTE';
  public static ALPHA_FLOAT: string = 'ALPHA FLOAT';
  public static RGBA_UNSIGNED_BYTE: string = 'RGBA UNSIGNED_BYTE';
  public static RGBA_FLOAT: string = 'RGBA FLOAT';
  public static RGBA_HALF_FLOAT: string = 'RGBA HALF_FLOAT';
  public static RGB_HALF_FLOAT: string = 'RGB HALF_FLOAT';
  public static RGB_UNSIGNED_BYTE: string = 'RGB UNSIGNED_BYTE';
  public static RGB_FLOAT: string = 'RGB_FLOAT';
  public static LUMINANCE_UNSIGNED_BYTE: string = 'LUMINANCE UNSIGNED_BYTE';
  public static LUMINANCE_FLOAT: string = 'LUMINANCE FLOAT';
  public static LUMINANCE_HALF_fLOAT: string = 'LUMINANCE HALF_FLOAT';
  public static DEPTH_UINTSHORT: string = 'DEPTH_UINTSHORT';
  public static DEPTH_FLOAT: string = 'DEPTH_FLOAT';
  public static RG_HALF_FLOAT: string = 'RG HALF_FLOAT';
  public static RG_FLOAT: string = 'RG FLOAT';

  public static checkFloatCompatibility(renderer: Renderer, formatType: string): string {
    if (renderer.isWebgl2) {
      return formatType;
    }
    if (!renderer.extensionManager.texture_float) {
      if (renderer.extensionManager.texture_half_float) {
        if (formatType === TextureFormat.RGB_FLOAT) {
          return TextureFormat.RGB_HALF_FLOAT;
        }
        if (formatType === TextureFormat.RGBA_FLOAT) {
          return TextureFormat.RGBA_HALF_FLOAT;
        }
      } else {
        console.log('Texture: setFormatType: not supported: ', formatType);
      }
    }
    return formatType;
  }

  public static checkHalfFloatCompatibility(renderer: Renderer, formatType: string): string {
    if (renderer.isWebgl2) {
      return formatType;
    }
    if (!renderer.extensionManager.texture_half_float) {
      if (renderer.extensionManager.texture_float) {
        if (formatType === TextureFormat.RGB_HALF_FLOAT) {
          return TextureFormat.RGB_FLOAT;
        }
        if (formatType === TextureFormat.RGBA_HALF_FLOAT) {
          return TextureFormat.RGBA_FLOAT;
        }
      } else {
        console.log('Texture: setFormatType: not supported: ', formatType);
      }
    }
    return formatType;
  }

  // TODO: rename
  public static validateFormatType(renderer: Renderer, formatType: string): string {
    switch (formatType) {
      case TextureFormat.RGB_FLOAT:
        formatType = this.checkFloatCompatibility(renderer, formatType);
      case TextureFormat.RGBA_FLOAT:
        formatType = this.checkFloatCompatibility(renderer, formatType);
      case TextureFormat.RGBA_HALF_FLOAT:
        formatType = this.checkHalfFloatCompatibility(renderer, formatType);
      case TextureFormat.RGB_HALF_FLOAT:
        formatType = this.checkHalfFloatCompatibility(renderer, formatType);
      default:
        break;
    }
    return formatType;
  }

  // TODO: implement all options
  public static getFormat(renderer: Renderer, formatType: string): number {
    switch (formatType) {
      case TextureFormat.RGBA_UNSIGNED_BYTE:
        return GL.RGBA;
      case TextureFormat.RGB_UNSIGNED_BYTE:
        return GL.RGB;
      case TextureFormat.RGB_FLOAT:
        return GL.RGB;
      case TextureFormat.RGBA_FLOAT:
        return GL.RGBA;
      case TextureFormat.RGBA_HALF_FLOAT:
        return GL.RGBA;
      case TextureFormat.RGB_HALF_FLOAT:
        return GL.RGB;
      case TextureFormat.RG_HALF_FLOAT:
        return GL2.RG;
      case TextureFormat.RG_FLOAT:
        return GL2.RG;
      case TextureFormat.LUMINANCE_UNSIGNED_BYTE:
        if (renderer.isWebgl2) {
          return GL2.RED;
        } else {
          return GL.LUMINANCE;
        }
      case TextureFormat.LUMINANCE_FLOAT:
        if (renderer.isWebgl2) {
          return GL2.RED;
        } else {
          return GL.LUMINANCE;
        }
      case TextureFormat.LUMINANCE_HALF_fLOAT:
        if (renderer.isWebgl2) {
          return GL2.RED;
        } else {
          return GL.LUMINANCE;
        }
      case TextureFormat.DEPTH_UINTSHORT:
        return GL.DEPTH_COMPONENT;
      case TextureFormat.DEPTH_FLOAT:
        return GL.DEPTH_COMPONENT;
      default:
        LogGL.error('can not yet get format for formatType: ', formatType);
        return -1;
    }
  }

  // TODO: implement all options
  public static getType(renderer: Renderer, formatType: string): number {
    switch (formatType) {
      case TextureFormat.RGBA_UNSIGNED_BYTE:
        return GL.UNSIGNED_BYTE;
      case TextureFormat.RGB_UNSIGNED_BYTE:
        return GL.UNSIGNED_BYTE;
      case TextureFormat.RGBA_FLOAT:
        return GL.FLOAT;
      case TextureFormat.RGB_FLOAT:
        return GL.FLOAT;
      case TextureFormat.RGBA_HALF_FLOAT:
        return TextureFormat.getHalfFloatType(renderer);
      case TextureFormat.RGB_HALF_FLOAT:
        return TextureFormat.getHalfFloatType(renderer);
      case TextureFormat.RG_HALF_FLOAT:
        return TextureFormat.getHalfFloatType(renderer);
      case TextureFormat.RG_FLOAT:
        return GL.FLOAT;
      case TextureFormat.LUMINANCE_UNSIGNED_BYTE:
        return GL.UNSIGNED_BYTE;
      case TextureFormat.LUMINANCE_FLOAT:
        return GL.FLOAT;
      case TextureFormat.LUMINANCE_HALF_fLOAT:
        return TextureFormat.getHalfFloatType(renderer);
      case TextureFormat.DEPTH_UINTSHORT:
        return GL.UNSIGNED_SHORT;
      case TextureFormat.DEPTH_FLOAT:
        return GL.FLOAT;
      default:
        LogGL.error('can not yet get type for formatType: ', formatType);
        return -1;
    }
  }

  public static getHalfFloatType(renderer: Renderer): number {
    if (renderer.isWebgl2) {
      return GL2.HALF_FLOAT;
    } else {
      const ext = renderer.extensionManager.texture_half_float;
      return ext ? ext.HALF_FLOAT_OES : -1;
    }
  }

  // TODO: when only using webgl2: only use InternalFormat, not formatType and remove this conversion
  // only used for webgl2
  public static getInternalFormat(formatType: string): number {
    switch (formatType) {
      case TextureFormat.RGBA_UNSIGNED_BYTE:
        return GL2.RGBA8;
      case TextureFormat.RGB_UNSIGNED_BYTE:
        return GL2.RGB8;
      case TextureFormat.RGBA_FLOAT:
        return GL2.RGBA32F;
      case TextureFormat.RGB_FLOAT:
        return GL2.RGB32F;
      case TextureFormat.RGBA_HALF_FLOAT:
        return GL2.RGBA16F;
      case TextureFormat.RGB_HALF_FLOAT:
        return GL2.RGB16F;
      case TextureFormat.RG_HALF_FLOAT:
        return GL2.RG16F;
      case TextureFormat.RG_FLOAT:
        return GL2.RG32F;
      case TextureFormat.LUMINANCE_UNSIGNED_BYTE:
        return GL2.R8;
      case TextureFormat.LUMINANCE_FLOAT:
        return GL2.R32F;
      case TextureFormat.LUMINANCE_HALF_fLOAT:
        return GL2.R16F;
      case TextureFormat.DEPTH_UINTSHORT:
        // TODO: test if correct
        return GL2.DEPTH_COMPONENT24;
      case TextureFormat.DEPTH_FLOAT:
        return GL2.DEPTH_COMPONENT32F;
      default:
        LogGL.error('can not yet get type for formatType: ', formatType);
        return -1;
    }
  }

  public static getBytesPerPixel(formatType: string): number {
    switch (formatType) {
      case TextureFormat.RGBA_UNSIGNED_BYTE:
        return 4;
      case TextureFormat.RGB_UNSIGNED_BYTE:
        return 3;
      case TextureFormat.RGB_FLOAT:
        return 12;
      case TextureFormat.RGBA_FLOAT:
        return 16;
      case TextureFormat.RGBA_HALF_FLOAT:
        return 8;
      case TextureFormat.RGB_HALF_FLOAT:
        return 6;
      case TextureFormat.RG_HALF_FLOAT:
        return 4;
      case TextureFormat.RG_HALF_FLOAT:
        return 8;
      case TextureFormat.LUMINANCE_UNSIGNED_BYTE:
        return 1;
      case TextureFormat.LUMINANCE_FLOAT:
        return 4;
      case TextureFormat.LUMINANCE_HALF_fLOAT:
        return 2;
      case TextureFormat.DEPTH_UINTSHORT:
        return 2;
      case TextureFormat.DEPTH_FLOAT:
        return 4;
      default:
        return 4;
    }
  }
}
