import LogGL from '../../renderer/core/LogGL';
import Utils from '../../renderer/core/Utils';

// data in parse return object is
//   rgb float (Float32Array) or
//   rgba unsigned in (Uint8Array)

/**
 * Original author: Nikos M. / https://github.com/foo123/
 * Converted to TS and use in Framework: Joey
 */

// source:
// https://github.com/mrdoob/three.js/issues/5552
// http://en.wikipedia.org/wiki/RGBE_image_format

export default class HDRImageParser {
  /* default error routine.  change this to change error handling */
  private static rgbe_read_error: number = 1;
  private static rgbe_write_error: number = 2;
  private static rgbe_format_error: number = 3;
  private static rgbe_memory_error: number = 4;

  /* flags indicating which fields in an rgbe_header_info are valid */
  private static RGBE_VALID_PROGRAMTYPE: number = 1;
  private static RGBE_VALID_FORMAT: number = 2;
  private static RGBE_VALID_DIMENSIONS: number = 4;

  public static parse(
    byteArray: any,
    convertToLDR: boolean = false,
  ): { data: ArrayBufferView; width: number; height: number } | null {
    // var byteArray:any = new Uint8Array(buffer);
    const byteLength = byteArray.byteLength;
    byteArray.pos = 0;
    const rgbe_header_info = HDRImageParser.parseHeader(byteArray);
    LogGL.log('HEADER:', rgbe_header_info);

    if (false !== rgbe_header_info) {
      const w = rgbe_header_info.width;
      const h = rgbe_header_info.height;
      const image_data = HDRImageParser.RGBE_ReadPixels_RLE(
        byteArray.subarray(byteArray.pos),
        w,
        h,
        convertToLDR,
      );

      if (image_data && image_data.length) {
        // TextureUtils.setFloatData(this, w, h, image_data, true);
        return { data: image_data, width: w, height: h };
      }
    }
    return null;
  }

  private static error(rgbe_error_code: number, msg: string) {
    switch (rgbe_error_code) {
      case HDRImageParser.rgbe_read_error:
        console.error('THREE.RGBELoader Read Error: ' + (msg || ''));
        break;
      case HDRImageParser.rgbe_write_error:
        console.error('THREE.RGBELoader Write Error: ' + (msg || ''));
        break;
      case HDRImageParser.rgbe_format_error:
        console.error('THREE.RGBELoader Bad File Format: ' + (msg || ''));
        break;
      default:
      case HDRImageParser.rgbe_memory_error:
        console.error('THREE.RGBELoader: Error: ' + (msg || ''));
    }
  }

  private static parseHeader(buffer: any): any {
    /* minimal header reading.  modify if you want to parse more information */
    let line;
    let match;
    // regexes to parse header info fields
    const magic_token_re = /^#\?(\S+)$/;
    const gamma_re = /^\s*GAMMA\s*=\s*(\d+(\.\d+)?)\s*$/;
    const exposure_re = /^\s*EXPOSURE\s*=\s*(\d+(\.\d+)?)\s*$/;
    const format_re = /^\s*FORMAT=(\S+)\s*$/;
    const dimensions_re = /^\s*\-Y\s+(\d+)\s+\+X\s+(\d+)\s*$/;

    // RGBE format header struct
    const header = {
      valid: 0 /* indicate which fields are valid */,
      string: '' /* the actual header string */,
      comments: '' /* comments found in header */,
      programtype: 'RGBE'
      /* listed at beginning of file to identify it
       * after "#?".  defaults to "RGBE" */,
      format: '' /* RGBE format, default 32-bit_rle_rgbe */,
      gamma: 1.0
      /* image has already been gamma corrected with
       * given gamma.  defaults to 1.0 (no correction) */,
      exposure: 1.0
      /* a value of 1.0 in an image corresponds to
       * <exposure> watts/steradian/m^2.
       * defaults to 1.0 */,
      width: 0,
      height: 0 /* image dimensions, width/height */,
    };

    if (buffer.pos >= buffer.byteLength || !(line = HDRImageParser.fgets(buffer))) {
      return HDRImageParser.error(HDRImageParser.rgbe_read_error, 'no header found');
    }
    /* if you want to require the magic token then uncomment the next line */
    if (!(match = line.match(magic_token_re))) {
      return HDRImageParser.error(HDRImageParser.rgbe_format_error, 'bad initial token');
    }
    header.valid |= HDRImageParser.RGBE_VALID_PROGRAMTYPE;
    header.programtype = match[1];
    header.string += line + '\n';

    while (true) {
      line = HDRImageParser.fgets(buffer);
      if (false === line) {
        break;
      }
      header.string += line + '\n';

      if ('#' === line.charAt(0)) {
        header.comments += line + '\n';
        continue; // comment line
      }

      if ((match = line.match(gamma_re))) {
        header.gamma = parseFloat(match[1]);
      }
      if ((match = line.match(exposure_re))) {
        header.exposure = parseFloat(match[1]);
      }
      if ((match = line.match(format_re))) {
        header.valid |= HDRImageParser.RGBE_VALID_FORMAT;
        header.format = match[1]; //'32-bit_rle_rgbe';
      }
      if ((match = line.match(dimensions_re))) {
        header.valid |= HDRImageParser.RGBE_VALID_DIMENSIONS;
        header.height = parseInt(match[1], 10);
        header.width = parseInt(match[2], 10);
      }

      if (
        header.valid & HDRImageParser.RGBE_VALID_FORMAT &&
        header.valid & HDRImageParser.RGBE_VALID_DIMENSIONS
      ) {
        break;
      }
    }

    if (!(header.valid & HDRImageParser.RGBE_VALID_FORMAT)) {
      return HDRImageParser.error(HDRImageParser.rgbe_format_error, 'missing format specifier');
    }
    if (!(header.valid & HDRImageParser.RGBE_VALID_DIMENSIONS)) {
      return HDRImageParser.error(HDRImageParser.rgbe_format_error, 'missing image size specifier');
    }

    return header;
  }

  private static fgets(buffer: any, lineLimit = 1024, consume = true): any {
    lineLimit = !lineLimit ? 1024 : lineLimit;
    var p = buffer.pos;
    var i = -1;
    var len = 0;
    var s = '';
    var chunkSize = 128;
    // @ts-ignore
    var chunk = String.fromCharCode.apply(null, new Uint16Array(buffer.subarray(p, p + chunkSize)));
    while (0 > (i = chunk.indexOf('\n')) && len < lineLimit && p < buffer.byteLength) {
      s += chunk;
      len += chunk.length;
      p += chunkSize;
      // @ts-ignore
      chunk += String.fromCharCode.apply(null, new Uint16Array(buffer.subarray(p, p + chunkSize)));
    }
    if (-1 < i) {
      if (false !== consume) {
        buffer.pos += len + i + 1;
      }
      return s + chunk.slice(0, i);
    }
    return false;
  }

  private static RGBE_ReadPixels_RLE(
    buffer: any,
    w: number,
    h: number,
    convertToLDR: boolean,
  ): Float32Array | Uint8Array | null {
    var data_rgb_float: Float32Array;
    var offset: number;
    var pos;
    var count: number;
    var byteValue;
    var scanline_buffer;
    var ptr;
    var ptr_end;
    var i;
    var l;
    var off;
    var isEncodedRun;
    var scanline_width = w;
    var num_scanlines = h;
    var rgbeStart;

    if (
      // run length encoding is not allowed so read flat
      scanline_width < 8 ||
      scanline_width > 0x7fff ||
      // this file is not run length encoded
      2 !== buffer[0] ||
      2 !== buffer[1] ||
      buffer[2] & 0x80
    ) {
      // return the flat buffer
      //            return new Uint8Array(buffer);
      let offset = 0;
      const data_rgb_float = new Float32Array(3 * w * h);
      for (let j = 0; j < w * h; j++) {
        const [x, y, z] = HDRImageParser.RgbeToFloat(
          buffer[j * 4 + 0],
          buffer[j * 4 + 1],
          buffer[j * 4 + 2],
          buffer[j * 4 + 3],
        );
        data_rgb_float[offset] = x;
        data_rgb_float[offset + 1] = y;
        data_rgb_float[offset + 2] = z;
        offset += 3;
      }
      return data_rgb_float;
    }

    if (scanline_width !== ((buffer[2] << 8) | buffer[3])) {
      HDRImageParser.error(HDRImageParser.rgbe_format_error, 'wrong scanline width');
      return null;
    }

    // NOTE(Joey): we don't store the exponent, only the RGB float components
    data_rgb_float = new Float32Array(3 * w * h);

    if (!data_rgb_float || !data_rgb_float.length) {
      HDRImageParser.error(HDRImageParser.rgbe_memory_error, 'unable to allocate buffer space');
      return null;
    }

    offset = 0;
    pos = 0;
    ptr_end = 4 * scanline_width;
    rgbeStart = new Uint8Array(4);
    scanline_buffer = new Uint8Array(ptr_end);

    // read in each successive scanline
    while (num_scanlines > 0 && pos < buffer.byteLength) {
      if (pos + 4 > buffer.byteLength) {
        HDRImageParser.error(HDRImageParser.rgbe_read_error, '');
        return null;
      }

      rgbeStart[0] = buffer[pos++];
      rgbeStart[1] = buffer[pos++];
      rgbeStart[2] = buffer[pos++];
      rgbeStart[3] = buffer[pos++];

      if (
        2 != rgbeStart[0] ||
        2 != rgbeStart[1] ||
        ((rgbeStart[2] << 8) | rgbeStart[3]) != scanline_width
      ) {
        HDRImageParser.error(HDRImageParser.rgbe_format_error, 'bad rgbe scanline format');
        return null;
      }

      // read each of the four channels for the scanline into the buffer
      // first red, then green, then blue, then exponent
      ptr = 0;
      while (ptr < ptr_end && pos < buffer.byteLength) {
        count = buffer[pos++];
        isEncodedRun = count > 128;
        if (isEncodedRun) {
          count -= 128;
        }

        if (0 === count || ptr + count > ptr_end) {
          HDRImageParser.error(HDRImageParser.rgbe_format_error, 'bad scanline data');
          return null;
        }

        if (isEncodedRun) {
          // a (encoded) run of the same value
          byteValue = buffer[pos++];
          for (i = 0; i < count; i++) {
            scanline_buffer[ptr++] = byteValue;
          }
          //ptr += count;
        } else {
          // a literal-run
          scanline_buffer.set(buffer.subarray(pos, pos + count), ptr);
          ptr += count;
          pos += count;
        }
      }

      // now convert data from buffer into rgba
      // first red, then green, then blue, then exponent (alpha)
      l = scanline_width; //scanline_buffer.byteLength;
      for (i = 0; i < l; i++) {
        off = 0;
        var r: number = scanline_buffer[i + off];
        off += scanline_width; //1;
        var g: number = scanline_buffer[i + off];
        off += scanline_width; //1;
        var b: number = scanline_buffer[i + off];
        off += scanline_width; //1;
        var exp: number = scanline_buffer[i + off];
        const [x, y, z] = HDRImageParser.RgbeToFloat(r, g, b, exp);
        data_rgb_float[offset] = x;
        data_rgb_float[offset + 1] = y;
        data_rgb_float[offset + 2] = z;
        offset += 3;
      }
      num_scanlines--;
    }

    if (convertToLDR) {
      const data_ldr = new Uint8Array((data_rgb_float.length / 3) * 4);
      for (let i = 0; i < data_rgb_float.length; i += 3) {
        data_ldr[(i * 4) / 3 + 0] = Utils.clamp(
          (Math.pow(data_rgb_float[i + 0], 1 / 2.2) * 255) | 0,
          0,
          255,
        );
        data_ldr[(i * 4) / 3 + 1] = Utils.clamp(
          (Math.pow(data_rgb_float[i + 1], 1 / 2.2) * 255) | 0,
          0,
          255,
        );
        data_ldr[(i * 4) / 3 + 2] = Utils.clamp(
          (Math.pow(data_rgb_float[i + 2], 1 / 2.2) * 255) | 0,
          0,
          255,
        );
        data_ldr[(i * 4) / 3 + 3] = 255;
      }
      return data_ldr;
    } else {
      return data_rgb_float;
    }
  }

  private static RgbeToFloat(r: number, g: number, b: number, exponent: number): number[] {
    var f: number = Math.pow(2.0, exponent - (128 + 8)); // NOTE(Joey): ldexp
    return [r * f, g * f, b * f];
  }
}
