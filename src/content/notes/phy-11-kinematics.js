/**
 * Sample Verified Notes for Kinematics (phy-11-kinematics)
 * Follows the custom structured block format (no markdown dependency required).
 */
export default {
  chapterId: 'phy-11-kinematics',
  sections: [
    {
      id: 'rectilinear-motion',
      title: '1. Rectilinear Motion and Calculus Essentials',
      blocks: [
        {
          type: 'p',
          text: 'Kinematics is the branch of classical mechanics describing the motion of points, bodies, and systems of bodies without considering the forces that cause them to move.',
        },
        {
          type: 'callout',
          text: 'Key Principle: Average velocity is displacement divided by elapsed time, while instantaneous velocity is the time derivative of position vector r(t).',
        },
        {
          type: 'formula',
          text: 'v(t) = dr/dt,    a(t) = dv/dt = d²r/dt²',
        },
        {
          type: 'list',
          items: [
            'If acceleration is constant: use standard kinematic equations v = u + at, s = ut + ½at², v² = u² + 2as.',
            'If acceleration depends on time a(t): integrate a(t) dt to find velocity, and integrate v(t) dt to find position.',
            'If acceleration depends on position a(x): use the differential transformation a = v (dv/dx), yielding ∫ a(x) dx = ∫ v dv.',
          ],
        },
      ],
    },
    {
      id: 'projectile-motion',
      title: '2. 2D Projectile Motion Under Uniform Gravity',
      blocks: [
        {
          type: 'p',
          text: 'Motion in two dimensions under constant gravitational acceleration g can be decomposed into two independent, mutually perpendicular motions: uniform velocity along the horizontal X-axis, and uniform acceleration along the vertical Y-axis.',
        },
        {
          type: 'formula',
          text: 'T = (2 u sin θ) / g,    H = (u² sin² θ) / (2 g),    R = (u² sin 2θ) / g',
        },
        {
          type: 'callout',
          text: 'Complementary angles of projection (θ and 90° - θ) produce identical horizontal ranges for the same initial launch speed u.',
        },
      ],
    },
  ],
};
