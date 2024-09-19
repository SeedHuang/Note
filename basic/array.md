# Array

> array说实话，很多方法都很实用，但是我用的最多的forEach，map，push，其他的用的少，为了让我以后可以继续记得这个方法怎么使用而不是每次都去找网上文章，让我每次的记忆在一个电商，我认为还是很有必要记录一下的


## push

解释：push就是吧一个象推到一个数组的最后一个

```javascript
const a = [1,2,3,4,5,6];
console.log(a.push(7));
// 显示的是7,代表数组的长度
console.log(a);
// 显示的是[1,2,3,4,5,6,7]
```

## pop

解释：这个就是和push相反的动作，从数组中把最一项去除

```java
const a = [1,2,3,4,5,6];
console.log(a.pop());
// 显示 6
console.log(a);
// 显示 [1,2,3,4,5]
```

## shift

解释：这个就是去除数组的第一个，对应pop，不过pop去除的是最后一个

```javascript
const a = [1,2,3,4,5,6];
console.log(a.shift());
// 显示的是1，这个是数组里面的项1
console.log(a);
// 显示的是[2,3,4,5,6];

```

## unshift

解释：这个就是给数组头部添加一个项，对应push给数组尾部添加一个项

```javascript
const a = [1,2,3,4,5,6];
console.log(a.unshift(0));
// 显示的是7，这个是数组的长度
console.log(a);
// 显示的是[0,1,2,3,4,5,6];
```

## forEach

## map

# some

## find

## filter

## every

## splice

## slice
