import Vector2 from 'mediamonks-webgl/renderer/math/Vector2';

export default class IntersectionUtils {
  public static findSegmentIntersection(
    l1p1: Vector2,
    l1p2: Vector2,
    l2p1: Vector2,
    l2p2: Vector2,
  ): Vector2 | false {
    const d = (l2p2.y - l2p1.y) * (l1p2.x - l1p1.x) - (l2p2.x - l2p1.x) * (l1p2.y - l1p1.y);
    if (d === 0) return false;
    const n_a = (l2p2.x - l2p1.x) * (l1p1.y - l2p1.y) - (l2p2.y - l2p1.y) * (l1p1.x - l2p1.x);
    const n_b = (l1p2.x - l1p1.x) * (l1p1.y - l2p1.y) - (l1p2.y - l1p1.y) * (l1p1.x - l2p1.x);
    const ua = n_a / d;
    const ub = n_b / d;
    if (ua >= 0 && ua <= 1 && ub >= 0 && ub <= 1) {
      return new Vector2(l1p1.x + ua * (l1p2.x - l1p1.x), l1p1.y + ua * (l1p2.y - l1p1.y));
    }
    return false;
  }
}
