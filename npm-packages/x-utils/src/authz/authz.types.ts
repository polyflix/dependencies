import { Namespace } from "./keto/namespaces";

export interface SubjectSet {
    /**
     * Namespace of the Subject Set
     * @type {string}
     * @memberof SubjectSet
     */
    namespace: Namespace;
    /**
     * Object of the Subject Set
     * @type {string}
     * @memberof SubjectSet
     */
    object: string;
    /**
     * Relation of the Subject Set
     * @type {string}
     * @memberof SubjectSet
     */
    relation: string;
}

export interface SubjectId {
    /**
     * ID of the Subject
     * @type {string}
     * @memberOf SubjectId
     */
    id: string;
}

/**
 * A Subject is a user, a service, or an application that can be authenticated.
 * @export
 * @interface Subject
 * @extends {SubjectId, SubjectSet}
 */
export type Subject = SubjectSet | SubjectId;
