// ** Libraries
import { AbilityBuilder, createMongoAbility } from '@casl/ability';

// ** DI injections
import { IPermission, IUserRoles } from 'src/common/interfaces';

export function defineAbility(role: IUserRoles) {
  const { can, cannot, rules } = new AbilityBuilder(createMongoAbility);
  let permissions: IPermission[] = [];
  for (const i of role.permissions) {
    if (i !== undefined) {
      i.can
        ? can(
          i.action,
          i.subject,
          i.fields && i.fields,
          i.conditions && i.conditions,
        )
        : cannot(
          i.action,
          i.subject,
          i.fields && i.fields,
          i.conditions && i.conditions,
        );
    }
  }
  return createMongoAbility(rules);
}
