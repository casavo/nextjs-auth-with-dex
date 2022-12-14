export function intersect<T>(a: T[], b: T[]) {
	const set1 = new Set(a);
	const set2 = new Set(b);
	return new Set([...set1].filter(x => set2.has(x)));
};

export function match<T>(arr1: T[], arr2: T[]) {
	const set1 = new Set(arr1);
	const set2 = new Set(arr2);

	if (set1.size !== set2.size) {
		return false;
	}

	for (let i = 0; i < arr1.length; i += 1) {
		const item = arr1[i];
		if (!set2.has(item)) {
			return false;
		}
	}

	return true;
};
