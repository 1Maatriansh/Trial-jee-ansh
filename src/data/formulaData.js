/**
 * Ansh JEE — Formula Registry
 * Clean typeset formulas stored per chapter.
 * Only chapters with verified formula entries will display the formula section.
 */

export const FORMULA_DATA = {
  'phy-11-kinematics': [
    { name: 'Velocity', formula: 'v = dx / dt', note: 'Instantaneous rate of change of position' },
    { name: 'Acceleration', formula: 'a = dv / dt = v (dv / dx)', note: 'Calculus form for variable acceleration' },
    { name: 'First Equation (Constant a)', formula: 'v = u + a t', note: 'Only valid for uniform acceleration' },
    { name: 'Second Equation (Constant a)', formula: 's = u t + 0.5 a t²', note: 'Displacement with constant acceleration' },
    { name: 'Third Equation (Constant a)', formula: 'v² = u² + 2 a s', note: 'Independent of time' },
    { name: 'Displacement in n-th Second', formula: 's_n = u + 0.5 a (2n - 1)', note: 'Distance covered specifically in the n-th second' },
    { name: 'Projectile Time of Flight', formula: 'T = (2 u sin θ) / g', note: 'Flat horizontal ground' },
    { name: 'Projectile Max Height', formula: 'H = (u² sin² θ) / (2 g)', note: 'Vertical velocity becomes zero at peak' },
    { name: 'Projectile Horizontal Range', formula: 'R = (u² sin 2θ) / g', note: 'Maximum at launch angle θ = 45°' },
    { name: 'Trajectory Equation', formula: 'y = x tan θ - (g x²) / (2 u² cos² θ)', note: 'Parabolic path equation in Cartesian coordinates' },
  ],
  'phy-11-laws-of-motion': [
    { name: "Newton's Second Law", formula: 'F_net = dp / dt = m a', note: 'External net force equals rate of momentum change' },
    { name: 'Static Friction Max', formula: 'f_s(max) = μ_s N', note: 'Limiting friction before relative motion begins' },
    { name: 'Kinetic Friction', formula: 'f_k = μ_k N', note: 'Opposes ongoing sliding motion (μ_k < μ_s)' },
    { name: 'Centripetal Force', formula: 'F_c = (m v²) / r = m ω² r', note: 'Directed toward the centre of circular curvature' },
    { name: 'Optimum Banking Angle', formula: 'tan θ = v² / (r g)', note: 'Speed without needing friction on banked turn' },
  ],
  'phy-11-work-energy-power': [
    { name: 'Work by Variable Force', formula: 'W = ∫ F · dr', note: 'Dot product integrated along path' },
    { name: 'Work-Energy Theorem', formula: 'W_all = ΔK = K_f - K_i', note: 'Work done by ALL forces equals change in kinetic energy' },
    { name: 'Conservative Force & Potential', formula: 'F = - dU / dr', note: 'Force is negative gradient of potential energy' },
    { name: 'Power', formula: 'P = dW / dt = F · v', note: 'Instantaneous rate of doing work' },
    { name: 'Coefficient of Restitution', formula: 'e = (v_2 - v_1) / (u_1 - u_2)', note: 'e = 1 (elastic), 0 < e < 1 (inelastic), e = 0 (plastic)' },
  ],
  'phy-12-electrostatics': [
    { name: "Coulomb's Law", formula: 'F = (1 / 4πε₀) · (|q₁ q₂| / r²)', note: 'Electrostatic force between point charges in vacuum' },
    { name: 'Electric Field of Point Charge', formula: 'E = (1 / 4πε₀) · (q / r²)', note: 'Force experienced per unit positive test charge' },
    { name: 'Electric Dipole Moment', formula: 'p = q · 2a', note: 'Vector pointing from negative to positive charge' },
    { name: 'Axial Field of Dipole', formula: 'E_axial = (1 / 4πε₀) · (2 p / r³)', note: 'For r >> a along dipole axis' },
    { name: 'Equatorial Field of Dipole', formula: 'E_eq = (1 / 4πε₀) · (p / r³)', note: 'Anti-parallel to dipole moment vector' },
    { name: "Gauss's Law", formula: '∮ E · dA = Q_enclosed / ε₀', note: 'Total electric flux through any closed Gaussian surface' },
  ],
  'che-11-basic-concepts': [
    { name: 'Mole Calculation', formula: 'n = mass (g) / molar mass (g/mol) = N / N_A', note: 'N_A ≈ 6.022 × 10²³ entities' },
    { name: 'Molarity (M)', formula: 'M = (moles of solute) / (volume of solution in litres)', note: 'Temperature-dependent concentration term' },
    { name: 'Molality (m)', formula: 'm = (moles of solute) / (mass of solvent in kg)', note: 'Temperature-independent concentration term' },
    { name: 'Mole Fraction (X_A)', formula: 'X_A = n_A / (n_A + n_B + ...)', note: 'Dimensionless; sum of all fractions equals 1' },
  ],
  'mat-11-complex-numbers': [
    { name: 'Modulus of z = x + iy', formula: '|z| = √(x² + y²)', note: 'Distance from origin in the complex plane' },
    { name: 'Conjugate Properties', formula: 'z · z̄ = |z|²', note: 'Product of a complex number and its conjugate is real' },
    { name: "Euler's Identity", formula: 'e^(iθ) = cos θ + i sin θ', note: 'Polar/exponential representation' },
    { name: 'Cube Roots of Unity', formula: '1 + ω + ω² = 0,  ω³ = 1', note: 'Roots of equation z³ - 1 = 0' },
  ],
};
