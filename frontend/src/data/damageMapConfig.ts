import { damageTypeEnum, severityEnum } from '@/schemas'

export type DamageRegion = {
  id: string
  label: string
  path: string
  defaultType?: typeof damageTypeEnum._type
  defaultSeverity?: typeof severityEnum._type
  notes?: string
}

export type DamageView = {
  id: string
  label: string
  viewBox: string
  outlinePath: string
  regions: DamageRegion[]
}

export const damageViews: DamageView[] = [
  {
    id: 'top',
    label: 'Top',
    viewBox: '0 0 600 280',
    outlinePath:
      'M70 40 L530 40 Q560 40 585 65 L585 215 Q560 240 530 240 L70 240 Q40 240 15 215 L15 65 Q40 40 70 40 Z',
    regions: [
      {
        id: 'bonnet',
        label: 'Bonnet',
        path: 'M60 90 L260 70 L330 70 L330 180 L260 180 Z'
      },
      {
        id: 'roof',
        label: 'Roof',
        path: 'M250 70 L470 75 L520 110 L520 190 L470 220 L250 215 Z'
      },
      {
        id: 'boot',
        label: 'Boot',
        path: 'M470 75 L545 110 L545 190 L470 220 Z'
      },
      {
        id: 'left_upper',
        label: 'Upper left side',
        path: 'M70 95 L60 120 L60 210 L200 200 L200 90 Z'
      },
      {
        id: 'right_upper',
        label: 'Upper right side',
        path: 'M530 95 L540 120 L540 210 L400 200 L400 90 Z'
      },
      {
        id: 'underbody',
        label: 'Underbody',
        path: 'M120 225 L480 225 L470 250 L130 250 Z'
      }
    ]
  },
  {
    id: 'left',
    label: 'Left side',
    viewBox: '0 0 640 320',
    outlinePath:
      'M45 220 Q55 160 120 140 L185 120 Q245 90 320 90 L470 95 Q535 100 585 150 L620 190 Q640 215 625 250 L600 290 Q585 310 555 310 L150 310 Q100 310 65 280 Q40 260 45 220 Z',
    regions: [
      {
        id: 'lf_bumper',
        label: 'Front bumper',
        path: 'M30 220 Q35 165 120 145 L170 140 L155 190 L60 230 Q40 240 35 230 Z'
      },
      {
        id: 'lf_guard_upper',
        label: 'Front guard upper',
        path: 'M150 135 L220 120 Q260 105 300 100 L300 160 L210 180 Z'
      },
      {
        id: 'lf_guard_lower',
        label: 'Front guard lower',
        path: 'M300 160 L215 185 L180 220 L250 215 L310 205 Z'
      },
      {
        id: 'lf_door_front',
        label: 'Front door',
        path: 'M245 120 L360 115 L355 250 L230 245 Z'
      },
      {
        id: 'lf_door_rear',
        label: 'Rear door',
        path: 'M360 115 L470 120 L465 250 L355 250 Z'
      },
      {
        id: 'lr_guard',
        label: 'Rear quarter',
        path: 'M470 120 L540 150 L575 200 Q580 220 565 245 L520 260 L465 250 Z'
      },
      {
        id: 'lr_bumper',
        label: 'Rear bumper',
        path: 'M520 260 L570 245 Q590 235 600 250 L615 265 Q630 280 600 295 L530 305 Z'
      },
      {
        id: 'roof_rail',
        label: 'Roof rail',
        path: 'M210 105 L450 105 L465 125 L205 125 Z'
      },
      {
        id: 'left_sill',
        label: 'Sill',
        path: 'M230 245 L460 245 L450 275 L215 270 Z'
      },
      {
        id: 'left_mirror',
        label: 'Mirror',
        path: 'M200 150 L225 155 L215 190 L185 185 Z'
      },
      {
        id: 'left_front_wheel',
        label: 'Front wheel',
        path: 'M250 270 m -35,0 a 35,35 0 1,0 70,0 a 35,35 0 1,0 -70,0'
      },
      {
        id: 'left_rear_wheel',
        label: 'Rear wheel',
        path: 'M470 270 m -35,0 a 35,35 0 1,0 70,0 a 35,35 0 1,0 -70,0'
      }
    ]
  },
  {
    id: 'right',
    label: 'Right side',
    viewBox: '0 0 640 320',
    outlinePath:
      'M45 220 Q40 260 65 280 Q100 310 150 310 L555 310 Q585 310 600 290 L625 250 Q640 215 620 190 L585 150 Q535 100 470 95 L320 90 Q245 90 185 120 L120 140 Q55 160 45 220 Z',
    regions: [
      {
        id: 'rf_bumper',
        label: 'Front bumper',
        path: 'M610 220 Q605 165 520 145 L470 140 L485 190 L575 230 Q595 240 600 230 Z'
      },
      {
        id: 'rf_guard_upper',
        label: 'Front guard upper',
        path: 'M490 135 L420 120 Q380 105 340 100 L340 160 L430 180 Z'
      },
      {
        id: 'rf_guard_lower',
        label: 'Front guard lower',
        path: 'M340 160 L425 185 L460 220 L390 215 L330 205 Z'
      },
      {
        id: 'rf_door_front',
        label: 'Front door',
        path: 'M395 120 L280 115 L285 250 L410 245 Z'
      },
      {
        id: 'rf_door_rear',
        label: 'Rear door',
        path: 'M280 115 L170 120 L175 250 L285 250 Z'
      },
      {
        id: 'rr_guard',
        label: 'Rear quarter',
        path: 'M170 120 L100 150 L65 200 Q60 220 75 245 L120 260 L175 250 Z'
      },
      {
        id: 'rr_bumper',
        label: 'Rear bumper',
        path: 'M120 260 L70 245 Q50 235 40 250 L25 265 Q10 280 40 295 L110 305 Z'
      },
      {
        id: 'roof_rail_right',
        label: 'Roof rail',
        path: 'M430 105 L190 105 L175 125 L435 125 Z'
      },
      {
        id: 'right_sill',
        label: 'Sill',
        path: 'M410 245 L180 245 L190 275 L425 270 Z'
      },
      {
        id: 'right_mirror',
        label: 'Mirror',
        path: 'M440 150 L415 155 L425 190 L455 185 Z'
      },
      {
        id: 'right_front_wheel',
        label: 'Front wheel',
        path: 'M390 270 m -35,0 a 35,35 0 1,0 70,0 a 35,35 0 1,0 -70,0'
      },
      {
        id: 'right_rear_wheel',
        label: 'Rear wheel',
        path: 'M170 270 m -35,0 a 35,35 0 1,0 70,0 a 35,35 0 1,0 -70,0'
      }
    ]
  },
  {
    id: 'front',
    label: 'Front',
    viewBox: '0 0 520 320',
    outlinePath:
      'M40 220 Q60 160 115 135 L160 120 L360 120 L405 135 Q460 160 480 220 L490 260 Q500 300 460 300 L60 300 Q20 300 30 260 Z',
    regions: [
      {
        id: 'front_bumper',
        label: 'Front bumper',
        path: 'M50 215 L470 215 L480 255 Q485 285 460 290 L60 290 Q35 285 40 255 Z'
      },
      {
        id: 'front_grille',
        label: 'Grille',
        path: 'M130 180 L390 180 L405 210 L120 210 Z'
      },
      {
        id: 'front_hood',
        label: 'Hood',
        path: 'M140 140 L380 140 L395 170 L125 170 Z'
      },
      {
        id: 'front_left_headlight',
        label: 'Left headlight',
        path: 'M130 170 L90 185 L100 215 L125 205 Z'
      },
      {
        id: 'front_right_headlight',
        label: 'Right headlight',
        path: 'M390 170 L430 185 L420 215 L395 205 Z'
      },
      {
        id: 'front_windscreen',
        label: 'Windscreen lower',
        path: 'M160 120 L360 120 L350 140 L170 140 Z'
      }
    ]
  },
  {
    id: 'rear',
    label: 'Rear',
    viewBox: '0 0 520 320',
    outlinePath:
      'M40 220 Q60 280 110 295 L410 295 Q460 280 480 220 L490 180 Q500 140 460 140 L60 140 Q20 140 30 180 Z',
    regions: [
      {
        id: 'rear_bumper',
        label: 'Rear bumper',
        path: 'M50 215 L470 215 L480 170 Q485 150 460 150 L60 150 Q35 150 40 170 Z'
      },
      {
        id: 'rear_tailgate',
        label: 'Tailgate',
        path: 'M110 200 L410 200 L420 240 L100 240 Z'
      },
      {
        id: 'rear_glass',
        label: 'Rear window',
        path: 'M120 170 L400 170 L390 195 L130 195 Z'
      },
      {
        id: 'rear_left_tail',
        label: 'Left tail light',
        path: 'M110 200 L80 195 L70 180 L95 180 Z'
      },
      {
        id: 'rear_right_tail',
        label: 'Right tail light',
        path: 'M410 200 L440 195 L450 180 L425 180 Z'
      }
    ]
  }
]
