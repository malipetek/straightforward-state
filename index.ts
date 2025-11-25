export type State<T> = T & {
  set<U> (data: U): State<T & U>;
  data: { [K in keyof T]: { value: T[K] } };

  when: WhenBuilder<T>;

  watch: Watcher<T>;
  once: Watcher<T>;
  until: UntilWatcher<T>;
}

export type WhenBuilder<T> = {
  [K in keyof T]: ConditionBuilder<T, T[K]>;
}

export type ConditionBuilder<T, V> = {
  is (value: V | ((val: V) => boolean)): ChainBuilder<T>;
}

export type ChainBuilder<T> = {
  and: WhenBuilder<T>;
  or: OrBuilder<T>;

  watch: Watcher<T>;
  once: Watcher<T>;
  until: UntilWatcher<T>;
}

export type OrBuilder<T> = WhenBuilder<T> & {
  more: ChainBuilder<T>;
  less: ChainBuilder<T>;
}

export type Watcher<T> = {
  [K in keyof T]: (value: T[K], oldValue: T[K], data: { [P in keyof T]: { value: T[P] } }) => void;
} & {
  all?: (key: keyof T, value: any, oldValue: any, data: any) => void;
}

export type UntilWatcher<T> = {
  [K in keyof T]: (value: T[K], oldValue: T[K], data: { [P in keyof T]: { value: T[P] } }) => boolean;
}

type InternalState<T> = State<T> & {
  conditionToSet: string;
  isValuesToCheckAgainst: any[];
  lastAccessedValue: any;
  allwatchers: any[];
  evaluateCondition: (entry: any) => boolean;
  [key: string]: any;
}

export const newState = <T extends object = {}> (): State<T> =>
{
  const state = {
    data: {},
    watch: {},
    once: {},
    until: {},
    when: {},
    and: {},
    or: { thisisor: 1 },
    isValuesToCheckAgainst: [],
    is: function (this: InternalState<T>, is: string)
    {
      this.conditionToSet += '_cvid_' + this.isValuesToCheckAgainst.length;
      this.isValuesToCheckAgainst = [...this.isValuesToCheckAgainst, is];
      return this;
    },
    conditionToSet: '',
    lastAccessedValue: null,
    allwatchers: [],
    evaluateCondition (this: InternalState<T>, entry: any)
    {
      return entry.condition ? entry.condition.split('_ncd_').reduce((result: any, cd: any) =>
        {
        let [condition, checkValueId] = cd.split('_cvid_');
          let orMore = false;
          let orLess = false;
          if (checkValueId) {
            if (checkValueId.indexOf('_omore_') > -1) {
              orMore = true;
              checkValueId = checkValueId.replace('_omore_', '');
            }
            if (checkValueId.indexOf('_oless_') > -1) {
              orLess = true;
              checkValueId = checkValueId.replace('_oless_', '');
            }
          }
          
          let checkValue = entry.isValues[checkValueId];
          
        const operator = condition[0] === '&' ? 'and' : condition[0] === '|' ? 'or' : 'none';
          if (checkValueId) {
            /*
            If is() method provided with a function we run the function and return early before value checking
            */
            if (checkValue.call) {
              return checkValue((this.data as any)[`_${condition}`]?.value);
            }
            if (orMore) {
              switch (operator) {
                case 'none':
                  return result && !!((this.data as any)[`_${condition}`]?.value >= checkValue);
                case 'and':
                  return result && !!(((this.data as any)[`_${condition.slice(1)}`]?.value) >= checkValue);
                case 'or':
                  return result || !!(((this.data as any)[`_${condition.slice(1)}`]?.value) >= checkValue);
              }
            } else if (orLess) { 
              switch (operator) {
                case 'none':
                  return result && !!((this.data as any)[`_${condition}`]?.value <= checkValue);
                case 'and':
                  return result && !!(((this.data as any)[`_${condition.slice(1)}`]?.value) <= checkValue);
                case 'or':
                  return result || !!(((this.data as any)[`_${condition.slice(1)}`]?.value) <= checkValue);
              }
            } else {
              switch (operator) {
                case 'none':
                  return result && !!((this.data as any)[`_${condition}`]?.value === checkValue);
                case 'and':
                  return result && !!(((this.data as any)[`_${condition.slice(1)}`]?.value) === checkValue);
                case 'or':
                  return result || !!(((this.data as any)[`_${condition.slice(1)}`]?.value) === checkValue);
              }
            }
          } else {
            switch (operator) {
              case 'none':
                return result && !!(this.data as any)[`_${condition}`]?.value;
              case 'and':
                return result && !!((this.data as any)[`_${condition.slice(1)}`]?.value);
              case 'or':
                return result || !!((this.data as any)[`_${condition.slice(1)}`]?.value);
            }
          }
        }, true) : true;
    }
  } as unknown as InternalState<T>;

  Object.defineProperty(state.or, 'more', {
    get: function ()
    {
      if (state.conditionToSet.indexOf('_cvid_') > -1) {
        state.conditionToSet += '_omore_';
        return state;
      } else {
        throw new Error('You must use the is() method before using the "more"');
      }
    }
  });

  Object.defineProperty(state.or, 'less', {
    get: function ()
    {
      if (state.conditionToSet.indexOf('_cvid_') > -1) {
        state.conditionToSet += '_oless_';
        return state;
      } else {
        throw new Error('You must use the is() method before using the "less"');
      }
    }
  });

  function setStateMembers (this: InternalState<T>, payl: any)
  {
    Object.keys(payl).forEach(key => {
      const altkey = `_${key}`;
      if (this[key]) return;
      (this.data as any)[altkey] = { value: payl[key] };
      (this.watch as any)[key] = {};
  
      Object.defineProperty(state, key, {
        set: (v) => {
          const was = (this.data as any)[altkey].value;
          (this.data as any)[altkey].value = v;
  
          // always run
          const watchers = (this.watch as any)[`get_${key}`];
          // run once
          const oncers = (this.once as any)[`get_${key}`];
          // run if returns true
          const until_watchers = (this.until as any)[`get_${key}`];

          this.allwatchers.forEach((entry: any) => entry(key, v, was, this.data));

          if (watchers && watchers.length) {
            watchers.forEach((entry: any) =>
            {
              let conditionResult = this.evaluateCondition(entry);
  
              if (!conditionResult) return;
                entry.fn(v, was, this.data);
            });
          }
          if (oncers && oncers.length) {
            (this.data as any)[altkey].once = oncers.filter((entry: any) =>
            {
              let conditionResult = this.evaluateCondition(entry);
  
              if (!conditionResult) return true;
              entry(v, was, this.data);
              return false;
            });
          }
          if (until_watchers && until_watchers.length) {
            const remaining_watchers = until_watchers.filter((entry: any) =>
            {
              let conditionResult = this.evaluateCondition(entry);
  
              if (!conditionResult) return true;
              return entry(v, was, this.data);
            });
            (this.data as any)[altkey].once = remaining_watchers;
          }
  
        },
        get: () => {
          if (this.conditionToSet) {
            throw new Error('You should you one of the following after declaring a "when statement": and, or, watch');
          }
          this.lastAccessedValue = altkey;
          return (this.data as any)[altkey].value;
        }
      });

      /*********
       * WATCH *
       *********/
      Object.defineProperty(this.watch, key, {
        set: (_fn) => {
          const setWatcher = (fn: any) =>
          {
            const condition = this.conditionToSet;
            condition
            const isValues = this.isValuesToCheckAgainst.slice();
            this.conditionToSet = '';
            this.isValuesToCheckAgainst = [];
            (this.data as any)[altkey].watch = [...((this.data as any)[altkey].watch || []), { condition, fn, isValues }];
          };
          if (_fn) { setWatcher(_fn); }
        },
        get: () => {
          const setWatcher = (fn: any) =>
          {
            const condition = this.conditionToSet;
            const isValues = this.isValuesToCheckAgainst.slice();
            this.conditionToSet = '';
            this.isValuesToCheckAgainst = [];
            (this.data as any)[altkey].watch = [...((this.data as any)[altkey].watch || []), { condition, fn, isValues }];
          };
          const callback = (_fn: any) => { if (_fn.call) { setWatcher(_fn); } };

          return callback;
        }
      });
  
      Object.defineProperty(this.watch, `get_${key}`, {
        get: () => {
          return (this.data as any)[altkey].watch;
        }
      });
  
      /********
       * ONCE *
       ********/
       Object.defineProperty(this.once, key, {
        set: (_fn) => {
           const setWatcher = (fn: any) =>
           {
            const condition = this.conditionToSet;
            const isValues = this.isValuesToCheckAgainst.slice();
            this.conditionToSet = '';
            this.isValuesToCheckAgainst = [];
             (this.data as any)[altkey].once = [...((this.data as any)[altkey].once || []), { condition, fn, isValues }];
          };
          if (_fn) { setWatcher(_fn); }
        },
        get: () => {
          const setWatcher = (fn: any) =>
          {
            const condition = this.conditionToSet;
            const isValues = this.isValuesToCheckAgainst.slice();
            this.conditionToSet = '';
            this.isValuesToCheckAgainst = [];
            (this.data as any)[altkey].once = [...((this.data as any)[altkey].once || []), { condition, fn, isValues }];
          };
          return (_fn: any) => { if (_fn.call) { setWatcher(_fn); } };
        }
      });
  
      Object.defineProperty(this.once, `get_${key}`, {
        get: () => {
          return (this.data as any)[altkey].once;
        }
      });
      /*********
       * UNTIL *
       *********/
       Object.defineProperty(this.until, key, {
        set: (_fn) => {
           const setWatcher = (fn: any) =>
           {
            const condition = this.conditionToSet;
            const isValues = this.isValuesToCheckAgainst.slice();
            this.conditionToSet = '';
            this.isValuesToCheckAgainst = [];
             (this.data as any)[altkey].until = [...((this.data as any)[altkey].until || []), { condition, fn, isValues }];
          };
          if (_fn) { setWatcher(_fn); }
        },
        get: () => {
          const setWatcher = (fn: any) =>
          {
            const condition = this.conditionToSet;
            const isValues = this.isValuesToCheckAgainst.slice();
            this.conditionToSet = '';
            this.isValuesToCheckAgainst = [];
            (this.data as any)[altkey].until = [...((this.data as any)[altkey].until || []), { condition, fn, isValues }];
          };
          return (_fn: any) => { if (_fn.call) { setWatcher(_fn); } };
        }
      });
  
      Object.defineProperty(this.until, `get_${key}`, {
        get: () => {
          return (this.data as any)[altkey].until;
        }
      });
  
      /********
       * WHEN *
       ********/
      Object.defineProperty(this.when, key, {
        get: () => {
          this.lastAccessedValue = altkey;
          this.conditionToSet = key;
          return this;
        }
      });
      /********
       * AND *
       ********/
      Object.defineProperty(this.and, key, {
        get: () =>
        {
          this.lastAccessedValue = altkey;
          this.conditionToSet += '_ncd_&' + key;
          return this;
        }
      });
      /********
       * OR *
       ********/
      Object.defineProperty(this.or, key, {
        get: () => {
          this.lastAccessedValue = altkey;
          this.conditionToSet += '_ncd_|' + key;
          return this;
        }
      });

    });
    return this;
  }
  
  Object.defineProperty(state, "set", {
    set: (payl) => setStateMembers.call(state, payl),
    get: () => (payl: any) =>
    {
      return setStateMembers.call(state, payl);
    }
  });
  /********************
   * when.watch ERROR *
   ********************/
  Object.defineProperty(state.when, 'watch', {
    get: () => {
      throw new Error('You should specify a state member to check after "when" before calling watch');
    }
  });
  /********************
   * when.and ERROR *
   ********************/
  Object.defineProperty(state.when, 'and', {
    get: () => {
      throw new Error('You should specify a state member to check after "when" before calling "and"');
    }
  });
  /********************
   * when.or ERROR *
   ********************/
  Object.defineProperty(state.when, 'or', {
    get: () => {
      const trace = console.trace();
      throw new Error('You should specify a state member to check after "when" before calling "or"');
    }
  });

  Object.defineProperty(state.watch, 'all', {
      get ()
      {
      return (fn: any) => state.allwatchers.push(fn);
      },
      set (fn)
      {
        state.allwatchers.push(fn);
      }
  });

  return state;
};

const globalState = newState();

export default globalState;