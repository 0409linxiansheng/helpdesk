import { __ } from "@/translation";
import { createResource } from "frappe-ui";

export const filterableFields = createResource({
  url: "helpdesk.api.doc.get_filterable_fields",
  params: {
    doctype: "HD Ticket",
    ignore_team_restrictions: true,
  },
  transform: (data: any[]) => {
    data = data
      .filter((field: any) => !field.fieldname.startsWith("_"))
      .map((field: any) => {
        return {
          ...field,
          label: __(field.label),
          value: field.fieldname,
        };
      });
    return data;
  },
});
