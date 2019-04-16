import {MigrationInterface, QueryRunner} from 'typeorm';

export class add_replacement_cost1515419505210 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query('Alter table vendor_eos add newEquipmentCost double default 0');

        // backfill with data
        await queryRunner.query('update vendor_eos set newEquipmentCost =5000 where new_pn = \'WS-C3750X-12S-E\'');
        await queryRunner.query('update vendor_eos set newEquipmentCost =13800 where new_pn = \'WS-C3750X-12S-S\'');
        await queryRunner.query('update vendor_eos set newEquipmentCost =2000 where new_pn = \'WS-C3560X-24P-E\'');
        await queryRunner.query('update vendor_eos set newEquipmentCost =1500 where new_pn = \'WS-C3560X-24P-S\'');
        await queryRunner.query('update vendor_eos set newEquipmentCost =1750 where new_pn = \'WS-C3560X-24T-E\'');
        await queryRunner.query('update vendor_eos set newEquipmentCost =1400 where new_pn = \'WS-C3560X-24T-S\'');
        await queryRunner.query('update vendor_eos set newEquipmentCost =1450 where new_pn = \'WS-C3560X-48P-E\'');
        await queryRunner.query('update vendor_eos set newEquipmentCost =1550 where new_pn = \'WS-C3560X-48PF-E\'');
        await queryRunner.query('update vendor_eos set newEquipmentCost =1400 where new_pn = \'WS-C3560X-48P-S\'');
        await queryRunner.query('update vendor_eos set newEquipmentCost =3000 where new_pn = \'WS-C3560X-48PF-S\'');
        await queryRunner.query('update vendor_eos set newEquipmentCost =2200 where new_pn = \'WS-C3560X-48T-E\'');
        await queryRunner.query('update vendor_eos set newEquipmentCost =2300 where new_pn = \'WS-C3560X-48T-S\'');
        await queryRunner.query('update vendor_eos set newEquipmentCost =2600 where new_pn = \'WS-C3750X-24P-S\'');
        await queryRunner.query('update vendor_eos set newEquipmentCost =2100 where new_pn = \'WS-C3750X-24T-E\'');
        await queryRunner.query('update vendor_eos set newEquipmentCost =6500 where new_pn = \'WS-C3750X-24T-S\'');
        await queryRunner.query('update vendor_eos set newEquipmentCost =3600 where new_pn = \'WS-C3750X-48P-E\'');
        await queryRunner.query('update vendor_eos set newEquipmentCost =3100 where new_pn = \'WS-C3750X-48PF-E\'');
        await queryRunner.query('update vendor_eos set newEquipmentCost =13000 where new_pn = \'WS-C3750X-48P-S\'');
        await queryRunner.query('update vendor_eos set newEquipmentCost =14000 where new_pn = \'WS-C3750X-48PF-S\'');
        await queryRunner.query('update vendor_eos set newEquipmentCost =3500 where new_pn = \'WS-C3750X-48T-E\'');
        await queryRunner.query('update vendor_eos set newEquipmentCost =4000 where new_pn = \'WS-C3750X-48T-S\'');
        await queryRunner.query('update vendor_eos set newEquipmentCost =2500 where new_pn = \'WS-C3750X-24P-E\'');
        await queryRunner.query('update vendor_eos set newEquipmentCost =11000 where new_pn = \'C1-CISCO4321/K9\'');
        await queryRunner.query('update vendor_eos set newEquipmentCost =3300 where new_pn = \'C1-CISCO4331/K9\'');
        await queryRunner.query('update vendor_eos set newEquipmentCost =8000 where new_pn = \'C1-CISCO4351/K9\'');
        await queryRunner.query('update vendor_eos set newEquipmentCost =3500 where new_pn = \'ISR4321-AX/K9\'');
        await queryRunner.query('update vendor_eos set newEquipmentCost =3100 where new_pn = \'ISR4321-V/K9\'');
        await queryRunner.query('update vendor_eos set newEquipmentCost =4100 where new_pn = \'ISR4321-VSEC/K9\'');
        await queryRunner.query('update vendor_eos set newEquipmentCost =7000 where new_pn = \'ISR4331/K9\'');
        await queryRunner.query('update vendor_eos set newEquipmentCost =5300 where new_pn = \'ISR4331-AX/K9\'');
        await queryRunner.query('update vendor_eos set newEquipmentCost =7000 where new_pn = \'ISR4331-AXV/K9\'');
        await queryRunner.query('update vendor_eos set newEquipmentCost =5000 where new_pn = \'ISR4331-V/K9\'');
        await queryRunner.query('update vendor_eos set newEquipmentCost =6500 where new_pn = \'ISR4331-VSEC/K9\'');
        await queryRunner.query('update vendor_eos set newEquipmentCost =12000 where new_pn = \'ISR4351-AX/K9\'');
        await queryRunner.query('update vendor_eos set newEquipmentCost =15000 where new_pn = \'ISR4351-AXV/K9\'');
        await queryRunner.query('update vendor_eos set newEquipmentCost =11000 where new_pn = \'ISR4351-V/K9\'');
        await queryRunner.query('update vendor_eos set newEquipmentCost =13500 where new_pn = \'ISR4351-VSEC/K9\'');
        await queryRunner.query('update vendor_eos set newEquipmentCost =4600 where new_pn = \'ISR4321/K9\'');
        await queryRunner.query('update vendor_eos set newEquipmentCost =3000 where new_pn = \'ISR4321-SEC/K9\'');
        await queryRunner.query('update vendor_eos set newEquipmentCost =4500 where new_pn = \'ISR4331-SEC/K9\'');
        await queryRunner.query('update vendor_eos set newEquipmentCost =12000 where new_pn = \'ISR4351/K9\'');
        await queryRunner.query('update vendor_eos set newEquipmentCost =10000 where new_pn = \'ISR4351-SEC/K9\'');
        await queryRunner.query('update vendor_eos set newEquipmentCost =500 where new_pn = \'C891F-K9\'');
        await queryRunner.query('update vendor_eos set newEquipmentCost =400 where new_pn = \'FL-C800-AX\'');
        await queryRunner.query('update vendor_eos set newEquipmentCost =2000 where new_pn = \'C891FW-A-K9\'');
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query('Alter table circuit drop expectedMonthlyCost');
    }

}
