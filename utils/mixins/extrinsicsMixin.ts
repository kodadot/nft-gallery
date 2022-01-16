import { Component, Vue } from 'nuxt-property-decorator';

/*
 * refer to https://stackoverflow.com/questions/51873087/unable-to-use-mixins-in-vue-with-typescript
 * import { Component, Mixins } from 'nuxt-property-decorator';
 * class ExtendedClass extends Mixins(ActualMixin) {
 */
@Component
export default class ExtrinsicMixin extends Vue {
  private fnSection = '';
  private fnMethod = '';
  private args: any[] = [];
  private selectedArguments = {};
  private section = {};

  get sections() {
    return Object.keys(this.section).sort();
  }

  protected setSection(section: any): void {
    this.section = section;
  }

  get methods() {
    return this.fnSection
      ? Object.keys(this.section[this.fnSection]).sort()
      : [];
  }

  get params() {
    console.log(this.args);
    return this.args;
  }

  protected handleSectionSelection(value: string): void {
    this.fnSection = value;
  }

  protected handleMethodSelection(value: string): void {
    this.fnMethod = value;
  }

  protected setArgs(args: any): void {
    this.args = args;
  }

  protected handleSelectedArguments(value: any): void {
    this.selectedArguments = {
      ...this.selectedArguments,
      ...value,
    };
  }

  protected hasArgs(): boolean {
    return this.args && this.args.length > 0;
  }

  protected getSection(): any {
    return this.section[this.fnSection][this.fnMethod];
  }

  protected getFnSection(): any {
    return this.section[this.fnSection];
  }

  protected argMapper(arg: any): any {
    const accessor: string = arg.name.toString();
    return this.selectedArguments[accessor];
  }

  protected mapArgs(): any[] {
    return this.args.map(this.argMapper);
  }

  protected getFnMethodAndSection(): { fnMethod: string; fnSection: string } {
    const { fnMethod, fnSection } = this;
    return { fnMethod, fnSection };
  }
}
