import { __ } from "@/translation";
import { createResource } from "frappe-ui";

// Title
export const newArticle = createResource({
  url: "frappe.client.insert",
  makeParams({ title, content, category }: Record<string, any>) {
    return {
      doc: {
        doctype: "HD Article",
        title,
        content,
        category,
      },
    };
  },
  validate({ doc }: Record<string, any>) {
    if (!doc.title) throw "Title is required";
    if (!doc.content) throw "Content is required";
  },
});

export const updateRes = createResource({
  url: "frappe.client.set_value",
});

export const deleteRes = createResource({
  url: "frappe.client.delete",
});

export const deleteArticles = createResource({
  url: "helpdesk.api.knowledge_base.delete_articles",
  makeParams({ articles }: Record<string, any>) {
    return {
      articles,
    };
  },
  validate({ articles }: Record<string, any>) {
    if (!articles) throw "Articles are required";
  },
});

// Category
export const newCategory = createResource({
  url: "helpdesk.api.knowledge_base.create_category",
  makeParams({ title }: Record<string, any>) {
    return {
      title,
    };
  },
  validate({ title }: Record<string, any>) {
    if (!title) throw "Title is required";
  },
});

export const updateCategoryTitle = createResource({
  url: "frappe.client.set_value",
  validate({ value }: Record<string, any>) {
    if (!value) throw "Title is required";
  },
});

export const moveToCategory = createResource({
  url: "helpdesk.api.knowledge_base.move_to_category",
  makeParams({ category, articles }: Record<string, any>) {
    return {
      category,
      articles,
    };
  },
  validate({ category, articles }: Record<string, any>) {
    if (!category) throw { message: __('Category is required') };
    if (!articles) throw { message: __('Articles are required') };
  },
});

export const mergeCategory = createResource({
  url: "helpdesk.api.knowledge_base.merge_category",
  makeParams({ source, target }: Record<string, any>) {
    return {
      source,
      target,
    };
  },
  validate({ source, target }: Record<string, any>) {
    if (!source) throw { message: __('Category is required') };
    if (!target) throw { message: __('Target is required') };
  },
});

export const categories = createResource({
  url: "helpdesk.api.knowledge_base.get_categories",
  cache: ["categories"],
});

export const categoryName = createResource({
  url: "helpdesk.api.knowledge_base.get_category_title",
  cache: ["categoryName"],
  makeParams({ category }: Record<string, any>) {
    return { category };
  },
});

//feedback
export const setFeedback = createResource({
  url: "run_doc_method",
  debounce: 300,
  makeParams: ({ articleId, action }: Record<string, any>) => ({
    dt: "HD Article",
    dn: articleId,
    method: "set_feedback",
    args: {
      value: action,
    },
  }),
});

// view count
export const incrementView = createResource({
  url: "helpdesk.api.knowledge_base.increment_views",
  makeParams: ({ article }: Record<string, any>) => ({
    article,
  }),
});

