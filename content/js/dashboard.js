/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 97.41051028179741, "KoPercent": 2.5894897182025893};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7477183833116037, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1c841a20-526c-4b8a-95b0-bdbb02a4a53b"], "isController": false}, {"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f941fc61-35e7-41b0-b7ea-5c4f79667600"], "isController": false}, {"data": [0.4666666666666667, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.4666666666666667, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4f66460c-836d-4105-a811-bc673f69235a"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e34c3750-f9e9-4646-bf3d-10319cd2247b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=603e6151-9447-485f-8073-2b20e7ed6f1b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.7333333333333333, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e8d835eb-d268-465b-a820-a17c2398ad88"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4abf60eb-4639-4374-9fe8-1a45e7ffc17a"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b87921d0-3415-4a9e-afd5-0a90d281ae9b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.4666666666666667, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.8043478260869565, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.06521739130434782, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4abf60eb-4639-4374-9fe8-1a45e7ffc17a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5be89982-b0d2-4c40-9fd8-4db866e26766"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2efdbefa-8da8-4f01-bbc3-c4e8f22b1d6c"], "isController": false}, {"data": [0.5357142857142857, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/642dc614-c615-4c48-bec8-9bb6d3af218d"], "isController": false}, {"data": [0.78125, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.16666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/4e36744e-7827-4385-9a6d-a51cf3020b2d"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f524d06c-f7ef-4ab9-ad8c-18933dfa53f1"], "isController": false}, {"data": [0.3125, 500, 1500, "register"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/e34c3750-f9e9-4646-bf3d-10319cd2247b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4f66460c-836d-4105-a811-bc673f69235a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b87921d0-3415-4a9e-afd5-0a90d281ae9b"], "isController": false}, {"data": [0.38181818181818183, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e8d835eb-d268-465b-a820-a17c2398ad88"], "isController": false}, {"data": [0.3125, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/603e6151-9447-485f-8073-2b20e7ed6f1b"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5666666666666667, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.41304347826086957, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5be89982-b0d2-4c40-9fd8-4db866e26766"], "isController": false}, {"data": [0.7272727272727273, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/100e139c-4224-40e6-8e84-b4979d555d73"], "isController": false}, {"data": [0.2796610169491525, 500, 1500, "addBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/82963884-6f6b-4c29-be5b-f419bdd239b0"], "isController": false}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9335260115606936, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.7894736842105263, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=82963884-6f6b-4c29-be5b-f419bdd239b0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f524d06c-f7ef-4ab9-ad8c-18933dfa53f1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f941fc61-35e7-41b0-b7ea-5c4f79667600"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1bf28aeb-ee65-4497-82a1-9c1a756ecbdd"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4e36744e-7827-4385-9a6d-a51cf3020b2d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1313, 34, 2.5894897182025893, 413.89794364051863, 126, 3010, 151.0, 1080.8000000000004, 1231.8999999999999, 1713.7599999999984, 5.127263923274577, 722.7649569400622, 3.744120077992596], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/1c841a20-526c-4b8a-95b0-bdbb02a4a53b", 1, 0, 0.0, 287.0, 287, 287, 287.0, 287.0, 287.0, 287.0, 3.484320557491289, 1.1126687717770036, 2.0790233013937285], "isController": false}, {"data": ["see books", 55, 0, 0.0, 2003.9454545454544, 1531, 2818, 1956.0, 2343.4, 2426.6, 2818.0, 0.24701338363424055, 297.2399719232799, 1.2145628775375013], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/f941fc61-35e7-41b0-b7ea-5c4f79667600", 3, 0, 0.0, 323.3333333333333, 241, 478, 251.0, 478.0, 478.0, 478.0, 0.06786409084739628, 0.030043998552232727, 0.043519615549925346], "isController": false}, {"data": ["deleteBook", 15, 4, 26.666666666666668, 531.5333333333333, 138, 1206, 506.0, 1119.0, 1206.0, 1206.0, 0.1008044192657406, 0.021283120552005, 0.06722919732801086], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 4, 26.666666666666668, 531.5333333333333, 138, 1206, 506.0, 1119.0, 1206.0, 1206.0, 0.09988479953120734, 0.021088958651022487, 0.0666158780206828], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4f66460c-836d-4105-a811-bc673f69235a", 3, 0, 0.0, 457.0, 409, 494, 468.0, 494.0, 494.0, 494.0, 0.023619815450508612, 0.023689014128586275, 0.015146821756999338], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e34c3750-f9e9-4646-bf3d-10319cd2247b", 1, 0, 0.0, 1716.0, 1716, 1716, 1716.0, 1716.0, 1716.0, 1716.0, 0.5827505827505828, 0.1052820877039627, 0.4017792103729604], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 16, 0, 0.0, 222.125, 130, 419, 140.0, 417.6, 419.0, 419.0, 0.10618670277014562, 0.02841323882716787, 0.060559603923598666], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=603e6151-9447-485f-8073-2b20e7ed6f1b", 1, 0, 0.0, 993.0, 993, 993, 993.0, 993.0, 993.0, 993.0, 1.0070493454179255, 0.18193762588116819, 0.6943133182275931], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 16, 0, 0.0, 139.18750000000003, 130, 145, 139.0, 142.9, 145.0, 145.0, 0.10619163608126315, 0.07891780767367311, 0.053303223579852795], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 16, 0, 0.0, 171.4375, 126, 413, 139.5, 396.90000000000003, 413.0, 413.0, 0.10618599804883229, 0.028620444786599326, 0.06252945002289635], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 16, 0, 0.0, 155.5, 130, 416, 138.5, 226.30000000000018, 416.0, 416.0, 0.10618740750081299, 0.028620824677953505, 0.062426581362782646], "isController": false}, {"data": ["goToProfile", 15, 4, 26.666666666666668, 248.46666666666673, 134, 468, 224.0, 441.6, 468.0, 468.0, 0.10082271334086143, 0.1565246368701941, 0.06515405290503844], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e8d835eb-d268-465b-a820-a17c2398ad88", 1, 0, 0.0, 424.0, 424, 424, 424.0, 424.0, 424.0, 424.0, 2.3584905660377355, 0.4260944870283019, 1.626068691037736], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4abf60eb-4639-4374-9fe8-1a45e7ffc17a", 1, 0, 0.0, 239.0, 239, 239, 239.0, 239.0, 239.0, 239.0, 4.184100418410042, 0.755916579497908, 2.884741108786611], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b87921d0-3415-4a9e-afd5-0a90d281ae9b", 1, 0, 0.0, 698.0, 698, 698, 698.0, 698.0, 698.0, 698.0, 1.4326647564469914, 0.25883103510028654, 0.9877551934097422], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 15, 0, 0.0, 158.66666666666666, 136, 415, 140.0, 251.8000000000001, 415.0, 415.0, 0.08891049084518313, 0.06607508157537535, 0.04462889872502356], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 15, 0, 0.0, 209.33333333333331, 132, 416, 139.0, 415.4, 416.0, 416.0, 0.08876527502441045, 0.041527816818060774, 0.049629959759741986], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 7, 0, 0.0, 840.4285714285714, 668, 972, 953.0, 972.0, 972.0, 972.0, 0.10255959445006081, 30.15592606735235, 0.0584910187098003], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 7, 0, 0.0, 1055.2857142857142, 940, 1378, 963.0, 1378.0, 1378.0, 1378.0, 0.1019531306893488, 91.7376062087636, 0.058045581242080424], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 7, 0, 0.0, 256.2857142857143, 140, 422, 143.0, 422.0, 422.0, 422.0, 0.10382521766215273, 0.1837219671912312, 0.05748915860785215], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 12, 0, 0.0, 140.08333333333331, 133, 145, 140.0, 144.4, 145.0, 145.0, 0.06716442971802133, 0.049914190444740464, 0.03371339538580368], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 12, 0, 0.0, 138.08333333333334, 135, 141, 138.0, 141.0, 141.0, 141.0, 0.0671633019718026, 0.017971430410423744, 0.03830407065579367], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 12, 0, 0.0, 184.75, 131, 417, 138.5, 417.0, 417.0, 417.0, 0.06716029483369433, 0.01810179821689417, 0.03948290770496483], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 12, 0, 0.0, 184.66666666666666, 135, 418, 139.0, 416.8, 418.0, 418.0, 0.06716217426345483, 0.01810230478194681, 0.039549600664905524], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 7, 0, 0.0, 181.42857142857142, 139, 424, 141.0, 424.0, 424.0, 424.0, 0.10382367773130431, 0.07715802612648691, 0.05829942841357421], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 14, 0, 0.0, 895.4285714285711, 133, 1402, 1068.5, 1396.5, 1402.0, 1402.0, 0.06708193579300431, 43.119768582295166, 0.03531908840440824], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 15, 0, 0.0, 304.20000000000005, 137, 1246, 139.0, 1231.6, 1246.0, 1246.0, 0.08890943684762702, 10.68755103031219, 0.05125027043287041], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 14, 0, 0.0, 724.3571428571429, 139, 1125, 944.0, 1112.0, 1125.0, 1125.0, 0.06717108956305207, 14.112694646224265, 0.03543162522850165], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 15, 0, 0.0, 248.46666666666667, 136, 691, 141.0, 680.2, 691.0, 691.0, 0.08891049084518313, 3.5064537902542248, 0.051337704642313096], "isController": false}, {"data": ["deleteBooks", 15, 4, 26.666666666666668, 665.6666666666666, 143, 3010, 424.0, 2233.6000000000004, 3010.0, 3010.0, 0.10007672548954198, 0.02112948051839744, 0.06709571087834007], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 12, 0, 0.0, 349.9166666666667, 273, 560, 281.5, 559.4, 560.0, 560.0, 0.06711034058497847, 0.10400792041832112, 0.15093272887422404], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 505.13043478260863, 144, 1330, 433.0, 963.2000000000003, 1275.5999999999992, 1330.0, 0.1103461510782738, 0.06778098537913498, 0.04989283979418044], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 14, 0, 0.0, 157.57142857142858, 129, 418, 140.0, 280.0, 418.0, 418.0, 0.06717012272940996, 0.0499184212862119, 0.03371625301066086], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 14, 0, 0.0, 263.3571428571429, 133, 536, 142.0, 476.0, 536.0, 536.0, 0.06708322152796413, 0.08991846992755012, 0.03423415518265803], "isController": false}, {"data": ["login", 23, 0, 0.0, 2451.347826086957, 1245, 4595, 2523.0, 3466.0000000000005, 4390.399999999997, 4595.0, 0.10821034208582492, 39.54652901360392, 0.21787714979839942], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 15, 0, 0.0, 143.66666666666666, 140, 155, 143.0, 150.2, 155.0, 155.0, 0.09022990579997835, 0.07304745303533404, 0.03207391182733606], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4abf60eb-4639-4374-9fe8-1a45e7ffc17a", 3, 0, 0.0, 295.3333333333333, 221, 442, 223.0, 442.0, 442.0, 442.0, 0.10940121070673182, 0.049501198854933995, 0.07015637535555393], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5be89982-b0d2-4c40-9fd8-4db866e26766", 3, 0, 0.0, 335.0, 280, 413, 312.0, 413.0, 413.0, 413.0, 0.01757973876508195, 0.024235089085326192, 0.011273465288805807], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2efdbefa-8da8-4f01-bbc3-c4e8f22b1d6c", 1, 0, 0.0, 500.0, 500, 500, 500.0, 500.0, 500.0, 500.0, 2.0, 0.638671875, 1.193359375], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 14, 0, 0.0, 1060.857142857143, 280, 1536, 1210.5, 1530.5, 1536.0, 1536.0, 0.06703600312196244, 57.31423021719665, 0.13851426370527142], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/642dc614-c615-4c48-bec8-9bb6d3af218d", 1, 0, 0.0, 1649.0, 1649, 1649, 1649.0, 1649.0, 1649.0, 1649.0, 0.6064281382656156, 0.19365429805942996, 0.3618433520315343], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 0, 0.0, 396.00000000000006, 261, 559, 286.5, 559.0, 559.0, 559.0, 0.10609376036071878, 0.16442460712154366, 0.238607353623765], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 15, 8, 53.333333333333336, 652.6666666666666, 134, 1636, 150.0, 1564.6000000000001, 1636.0, 1636.0, 0.14201855709145994, 79.30859892775989, 0.19963038191156976], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4e36744e-7827-4385-9a6d-a51cf3020b2d", 3, 0, 0.0, 624.6666666666666, 224, 1144, 506.0, 1144.0, 1144.0, 1144.0, 0.02885364469621921, 0.028938176858415165, 0.018503151058447867], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f524d06c-f7ef-4ab9-ad8c-18933dfa53f1", 1, 0, 0.0, 3010.0, 3010, 3010, 3010.0, 3010.0, 3010.0, 3010.0, 0.33222591362126247, 0.060021283222591364, 0.22905419435215948], "isController": false}, {"data": ["register", 24, 7, 29.166666666666668, 941.6250000000002, 152, 1552, 943.0, 1513.0, 1549.5, 1552.0, 0.0944647587409422, 0.02965861321798137, 0.042619842322573535], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/e34c3750-f9e9-4646-bf3d-10319cd2247b", 3, 0, 0.0, 689.0, 424, 912, 731.0, 912.0, 912.0, 912.0, 0.035283740076448106, 0.02941460232284622, 0.022626617171420168], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4f66460c-836d-4105-a811-bc673f69235a", 1, 0, 0.0, 412.0, 412, 412, 412.0, 412.0, 412.0, 412.0, 2.4271844660194173, 0.43850500606796117, 1.6734299150485439], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 19, 0, 0.0, 163.94736842105266, 140, 426, 145.0, 186.0, 426.0, 426.0, 0.10213571148274175, 0.07929481506716768, 0.03630605369113086], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 15, 0, 0.0, 519.6666666666667, 278, 1387, 284.0, 1370.2, 1387.0, 1387.0, 0.08869179600886917, 14.266623937546195, 0.19644424427198817], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 0, 0.0, 564.9374999999999, 275, 1104, 555.0, 1102.6, 1104.0, 1104.0, 0.12462029753096035, 18.805145090154998, 0.27628831100553003], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 11, 0, 0.0, 164.72727272727272, 133, 419, 141.0, 364.4000000000002, 419.0, 419.0, 0.049979099649237586, 0.037142670735419735, 0.025087165253621212], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 11, 0, 0.0, 138.54545454545453, 131, 156, 138.0, 152.8, 156.0, 156.0, 0.04997978090681497, 0.013373496062956349, 0.028504093798417913], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 11, 0, 0.0, 164.0, 129, 412, 139.0, 361.6000000000002, 412.0, 412.0, 0.04997978090681497, 0.013471112822539972, 0.02938264463467052], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 11, 0, 0.0, 188.27272727272728, 132, 408, 139.0, 405.6, 408.0, 408.0, 0.04991876854936059, 0.013454668085569846, 0.02939552483912542], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 4, 4, 100.0, 148.0, 143, 154, 147.5, 154.0, 154.0, 154.0, 0.05756058251309504, 0.016975874920854197, 0.03558188352616128], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b87921d0-3415-4a9e-afd5-0a90d281ae9b", 3, 0, 0.0, 418.33333333333337, 219, 715, 321.0, 715.0, 715.0, 715.0, 0.03649635036496351, 0.03042550562652068, 0.0234042350973236], "isController": false}, {"data": ["https://demoqa.com/books", 55, 0, 0.0, 1288.290909090909, 1010, 2250, 1113.0, 1769.0, 1796.0, 2250.0, 0.2362979416301121, 282.6944886458839, 0.4665961308360221], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e8d835eb-d268-465b-a820-a17c2398ad88", 3, 0, 0.0, 315.6666666666667, 231, 441, 275.0, 441.0, 441.0, 441.0, 0.05476851175697386, 0.024781325306703666, 0.035121734427486485], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 7, 29.166666666666668, 941.6250000000002, 152, 1552, 943.0, 1513.0, 1549.5, 1552.0, 0.09747974249101359, 0.030605212119981316, 0.04398011819418777], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 11, 0, 0.0, 210.45454545454544, 131, 416, 138.0, 414.0, 416.0, 416.0, 0.057016679970558655, 0.01536777702331464, 0.033575251974850465], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 11, 0, 0.0, 262.3636363636364, 132, 419, 141.0, 418.2, 419.0, 419.0, 0.05693640720918436, 0.015346141005600472, 0.0334723800194619], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/603e6151-9447-485f-8073-2b20e7ed6f1b", 3, 0, 0.0, 318.6666666666667, 212, 491, 253.0, 491.0, 491.0, 491.0, 0.025723913807739467, 0.025799276836473078, 0.016496129622801677], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 19, 0, 0.0, 255.52631578947373, 135, 1378, 139.0, 561.0, 1378.0, 1378.0, 0.10021361322819695, 4.7715041024947915, 0.05846137490440149], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 19, 0, 0.0, 260.6315789473684, 130, 1116, 141.0, 412.0, 1116.0, 1116.0, 0.10007373854419047, 1.5742376784209415, 0.05847750480617297], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 19, 0, 0.0, 182.57894736842104, 135, 417, 141.0, 411.0, 417.0, 417.0, 0.100209913397538, 0.07447240634328751, 0.05030067918587357], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 11, 0, 0.0, 186.8181818181818, 135, 410, 138.0, 408.8, 410.0, 410.0, 0.057017566593926074, 0.015256653561265375, 0.032517830948098465], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 19, 0, 0.0, 195.8947368421053, 134, 413, 139.0, 412.0, 413.0, 413.0, 0.10006741383668998, 0.03468619649026713, 0.056627375942740366], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 11, 0, 0.0, 220.63636363636365, 138, 476, 142.0, 463.6, 476.0, 476.0, 0.05701549784896076, 0.04237186900689369, 0.02861910731871663], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 11, 0, 0.0, 145.00000000000003, 138, 151, 146.0, 151.0, 151.0, 151.0, 0.05606209641661273, 0.04412700167166978, 0.019928323335592805], "isController": false}, {"data": ["deleteAccount", 15, 4, 26.666666666666668, 466.53333333333336, 135, 1006, 478.0, 841.0000000000001, 1006.0, 1006.0, 0.09893153937475267, 0.020166318345205117, 0.06731338007848568], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 1183.2608695652175, 683, 2001, 1093.0, 1860.2, 1980.9999999999998, 2001.0, 0.10971816742038278, 0.056787723371877805, 0.05046607114746122], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5be89982-b0d2-4c40-9fd8-4db866e26766", 1, 0, 0.0, 492.0, 492, 492, 492.0, 492.0, 492.0, 492.0, 2.032520325203252, 0.36720337906504064, 1.4013274898373984], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 11, 0, 0.0, 509.18181818181813, 280, 893, 548.0, 880.8000000000001, 893.0, 893.0, 0.0568942955710377, 0.08817504596800471, 0.12795660419931623], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/100e139c-4224-40e6-8e84-b4979d555d73", 1, 0, 0.0, 247.0, 247, 247, 247.0, 247.0, 247.0, 247.0, 4.048582995951417, 1.2928580465587045, 2.4157072368421053], "isController": false}, {"data": ["addBook", 59, 11, 18.64406779661017, 1221.2881355932207, 712, 2280, 1097.0, 2012.0, 2052.0, 2280.0, 0.2727730851560586, 84.07723776508689, 0.9909108988451065], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/82963884-6f6b-4c29-be5b-f419bdd239b0", 3, 0, 0.0, 908.0, 299, 1700, 725.0, 1700.0, 1700.0, 1700.0, 0.027508550574470228, 0.027589142031231372, 0.01764057442438358], "isController": false}, {"data": ["https://demoqa.com/books-0", 55, 0, 0.0, 254.09090909090904, 134, 786, 143.0, 554.2, 566.5999999999999, 786.0, 0.23726327595875932, 0.17632554004357015, 0.11469269687459557], "isController": false}, {"data": ["https://demoqa.com/books-3", 55, 0, 0.0, 774.9636363636362, 643, 1118, 693.0, 968.8, 995.7999999999997, 1118.0, 0.23740255704135985, 69.80423427693655, 0.11939679382451203], "isController": false}, {"data": ["https://demoqa.com/books-1", 55, 0, 0.0, 205.21818181818185, 131, 430, 142.0, 417.8, 421.4, 430.0, 0.23797058683546712, 0.4210963899861977, 0.11573178930084241], "isController": false}, {"data": ["https://demoqa.com/books-2", 55, 0, 0.0, 1030.0000000000002, 875, 1423, 964.0, 1240.8, 1249.0, 1423.0, 0.2371405165351615, 213.37945362690252, 0.11903342333893847], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 16, 0, 0.0, 147.62500000000003, 139, 173, 142.5, 168.8, 173.0, 173.0, 0.11706517603675848, 0.08745591764464866, 0.04161301179431649], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 173, 11, 6.358381502890174, 188.34682080924864, 128, 628, 145.0, 300.59999999999997, 377.59999999999997, 526.6199999999988, 0.7257776938728421, 1.6005399085960605, 0.34857420604954586], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 11, 0, 0.0, 191.00000000000003, 139, 409, 142.0, 408.4, 409.0, 409.0, 0.0510746572194028, 0.039552932788072676, 0.018155444558459587], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 16, 0, 0.0, 142.75, 132, 170, 140.5, 155.3, 170.0, 170.0, 0.10062133675445879, 0.08165657308882349, 0.03576774079943652], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 11, 0, 0.0, 355.90909090909093, 266, 832, 281.0, 775.4000000000002, 832.0, 832.0, 0.04988639507303822, 0.07731416892667153, 0.11219567173164748], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 19, 0, 0.0, 483.0, 277, 1514, 285.0, 827.0, 1514.0, 1514.0, 0.09999263212184366, 6.442915472675697, 0.22353924414779963], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=82963884-6f6b-4c29-be5b-f419bdd239b0", 1, 0, 0.0, 627.0, 627, 627, 627.0, 627.0, 627.0, 627.0, 1.594896331738437, 0.2881404505582137, 1.099606259968102], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 12, 0, 0.0, 167.33333333333334, 140, 415, 144.5, 336.7000000000003, 415.0, 415.0, 0.0689619502439529, 0.05717646070030861, 0.024513818250780132], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f524d06c-f7ef-4ab9-ad8c-18933dfa53f1", 3, 0, 0.0, 502.33333333333337, 215, 1006, 286.0, 1006.0, 1006.0, 1006.0, 0.035648505733468006, 0.029718692442516785, 0.022860532648089835], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f941fc61-35e7-41b0-b7ea-5c4f79667600", 1, 0, 0.0, 273.0, 273, 273, 273.0, 273.0, 273.0, 273.0, 3.663003663003663, 0.6617731227106226, 2.525469322344322], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 14, 0, 0.0, 164.21428571428572, 140, 420, 143.5, 288.5, 420.0, 420.0, 0.06615006615006615, 0.05135674080986581, 0.02351428132678133], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1bf28aeb-ee65-4497-82a1-9c1a756ecbdd", 1, 0, 0.0, 238.0, 238, 238, 238.0, 238.0, 238.0, 238.0, 4.201680672268908, 1.341747636554622, 2.5070575105042017], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4e36744e-7827-4385-9a6d-a51cf3020b2d", 1, 0, 0.0, 509.0, 509, 509, 509.0, 509.0, 509.0, 509.0, 1.9646365422396854, 0.35493921905697445, 1.3545248035363457], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 16, 0, 0.0, 174.06250000000003, 137, 416, 139.5, 410.4, 416.0, 416.0, 0.12475536253128632, 0.09271370203741101, 0.06262134408308707], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 16, 0, 0.0, 269.75, 137, 563, 149.5, 465.7000000000001, 563.0, 563.0, 0.12475633528265107, 0.05680433723196881, 0.06984039961013645], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 16, 0, 0.0, 327.25, 137, 962, 142.5, 959.2, 962.0, 962.0, 0.12475536253128632, 14.061309097979743, 0.07200236255467793], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 16, 0, 0.0, 328.18750000000006, 135, 963, 141.0, 958.1, 963.0, 963.0, 0.12475633528265107, 4.614735623781677, 0.07212475633528265], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 20.58823529411765, 0.5331302361005331], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 4, 11.764705882352942, 0.30464584920030463], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 4, 11.764705882352942, 0.30464584920030463], "isController": false}, {"data": ["401/Unauthorized", 19, 55.88235294117647, 1.4470677837014472], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1313, 34, "401/Unauthorized", 19, "406/Not Acceptable", 7, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 4, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 15, 8, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 4, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 4, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 173, 11, "401/Unauthorized", 11, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
