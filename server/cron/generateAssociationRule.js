const cron = require("node-cron");
const Apriori = require("node-apriori");

const Order = require("../models/orderModel");
const RecommendationRule = require("../models/recommendationRuleModel");

const getSubsets = (items) => {
    const subsets = [];
    const subsetCount = 2 ** items.length;

    for (let mask = 1; mask < subsetCount - 1; mask += 1) {
        const subset = items.filter((_, index) => mask & (1 << index));
        subsets.push(subset);
    }

    return subsets;
};

const generateAssociationRules = async () => {
    try {

        const orders = await Order.find()
            .populate("products.product", "product_id");

        const transactions = orders
            .map(order =>
                order.products
                    .map(item => item.product?.product_id)
                    .filter(Boolean)
            )
            .filter(t => t.length > 1);

        if (!transactions.length) {
            console.log("No transactions found.");
            return;
        }

        const apriori = new Apriori.Apriori(0.02);

        const result = await apriori.exec(transactions);
        const itemsets = result.itemsets || [];
        const supportByItems = new Map(
            itemsets.map(itemset => [itemset.items.slice().sort().join("|"), itemset.support])
        );
        const rules = [];

        itemsets
            .filter(itemset => itemset.items.length > 1)
            .forEach(itemset => {
                const items = itemset.items.slice().sort();
                const itemsetSupport = itemset.support;

                getSubsets(items).forEach(lhs => {
                    const rhs = items.filter(item => !lhs.includes(item));
                    const lhsSupport = supportByItems.get(lhs.slice().sort().join("|"));
                    const rhsSupport = supportByItems.get(rhs.slice().sort().join("|"));

                    if (!lhsSupport || !rhsSupport) return;

                    rules.push({
                        lhs: lhs.sort(),
                        rhs: rhs.sort(),
                        support: itemsetSupport / transactions.length,
                        confidence: itemsetSupport / lhsSupport,
                        lift: (itemsetSupport * transactions.length) / (lhsSupport * rhsSupport)
                    });
                });
            });

        await RecommendationRule.deleteMany({});
        await RecommendationRule.insertMany(rules);

        console.log(`Generated ${rules.length} recommendation rules.`);

    } catch (err) {
        console.error("Recommendation cron failed:", err);
    }
};

// Every day at 2:00 AM
cron.schedule("0 2 * * *", generateAssociationRules);

// Run once when server starts (optional)
generateAssociationRules();

module.exports = {};