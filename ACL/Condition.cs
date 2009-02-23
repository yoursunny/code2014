using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Xml.Linq;

namespace yoursunny.P2008.hProxyN
{
    /// <summary>
    /// represents a function to evaluate a condition
    /// </summary>
    public delegate bool ACLConditionEvaluator(XElement condition, ACLArgs a);
    public partial class ACL : IPlugin
    {
        Dictionary<string, ACLConditionEvaluator> ConditionEvaluators;
        [CallablePluginMethod]
        public void RegisterConditionEvaluator(string name, ACLConditionEvaluator evaluator)
        {
            ConditionEvaluators[name] = evaluator;
        }
        void RegisterBuiltInConditionEvaluators()
        {
            RegisterConditionEvaluator("and", new ACLConditionEvaluator(TestAndCondition));
            RegisterConditionEvaluator("or", new ACLConditionEvaluator(TestOrCondition));
            RegisterConditionEvaluator("not", new ACLConditionEvaluator(TestNotCondition));
            new SimpleConditions().Register(this);
            new ScriptingCondition().Register(this);
        }
        /// <summary>
        /// test whether a single condition is met
        /// </summary>
        bool TestCondition(XElement condition, ACLArgs a)
        {
            string name = condition.Name.LocalName;
            ACLConditionEvaluator evaluator;
            if (!ConditionEvaluators.TryGetValue(name, out evaluator)) return false;
            return evaluator(condition, a);
        }
        /// <summary>
        /// test an and group condition
        /// </summary>
        bool TestAndCondition(XElement condition, ACLArgs a)
        {
            return TestAndGroup(condition.Elements(), a);
        }
        /// <summary>
        /// test an or group condition
        /// </summary>
        bool TestOrCondition(XElement condition, ACLArgs a)
        {
            return TestOrGroup(condition.Elements(), a);
        }
        /// <summary>
        /// test a not condition
        /// </summary>
        bool TestNotCondition(XElement condition, ACLArgs a)
        {
            return !TestAndGroup(condition.Elements(), a);
        }
        /// <summary>
        /// test some conditions
        /// </summary>
        /// <returns>true if all conditions are true</returns>
        /// <remarks>when a condition is false, the remaining won't be tested</remarks>
        public bool TestAndGroup(IEnumerable<XElement> conditions, ACLArgs a)
        {
            foreach (XElement cond in conditions)
            {
                if (!TestCondition(cond, a)) return false;
            }
            return true;
        }
        /// <summary>
        /// test some condtions
        /// </summary>
        /// <returns>true if any condition is true</returns>
        /// <remarks>when a condition is true, the remaing won't be tested</remarks>
        public bool TestOrGroup(IEnumerable<XElement> conditions, ACLArgs a)
        {
            // <or> condition ... condition </or>
            foreach (XElement cond in conditions)
            {
                if (TestCondition(cond, a)) return true;
            }
            return false;
        }
    }
}
