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

    var data = {"OkPercent": 97.72899318697957, "KoPercent": 2.2710068130204393};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7575953458306399, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.08771929824561403, 500, 1500, "see books"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d315e107-2bf0-4efa-a6ba-8c4f7c43a811"], "isController": false}, {"data": [0.53125, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.53125, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=24406bd3-1c61-49cd-b643-51162626c94d"], "isController": false}, {"data": [0.75, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/892ca156-4869-4fe8-922d-30a783142142"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/2bc6fabb-dc98-482d-a5b5-8356d3a18034"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a92cf8b8-ba28-4869-90f2-db9785637f1c"], "isController": false}, {"data": [0.46875, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d9f4a558-3a27-46b5-a066-212f52f323ae"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2bc6fabb-dc98-482d-a5b5-8356d3a18034"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1d15d3ca-4523-42ed-937e-65b7396c666d"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/3cad325d-8dbc-4789-8263-5cc7cdb9f022"], "isController": false}, {"data": [0.8125, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7f9dce26-b79d-403d-9fcd-6d2ff556fc8f"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/656288ed-13be-4a70-8f47-170e71194c4f"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f53caa46-ebe0-4bd2-a778-ae7d9963147b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a3093efe-79c6-4519-8cba-3560412c504a"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.23333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.18, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b5b3858c-0d3c-4bf5-afbc-629bbd5ba51a"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c33a75b8-9b3f-4430-aaf8-cb2b093a441f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f53caa46-ebe0-4bd2-a778-ae7d9963147b"], "isController": false}, {"data": [0.90625, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/d315e107-2bf0-4efa-a6ba-8c4f7c43a811"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.4298245614035088, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.18, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/24406bd3-1c61-49cd-b643-51162626c94d"], "isController": false}, {"data": [0.9761904761904762, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cff5e4dd-d4fd-4952-a017-fc35cae5f000"], "isController": false}, {"data": [0.9761904761904762, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/78298e2b-01cd-479c-8616-125b7e785cda"], "isController": false}, {"data": [0.3125, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.29464285714285715, 500, 1500, "addBook"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d9f4a558-3a27-46b5-a066-212f52f323ae"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7f9dce26-b79d-403d-9fcd-6d2ff556fc8f"], "isController": false}, {"data": [0.9912280701754386, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5263157894736842, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a92cf8b8-ba28-4869-90f2-db9785637f1c"], "isController": false}, {"data": [0.9378698224852071, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=892ca156-4869-4fe8-922d-30a783142142"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9761904761904762, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=656288ed-13be-4a70-8f47-170e71194c4f"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/1d15d3ca-4523-42ed-937e-65b7396c666d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/cff5e4dd-d4fd-4952-a017-fc35cae5f000"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/74df1d49-3194-45b5-90aa-18a2d555b82b"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c33a75b8-9b3f-4430-aaf8-cb2b093a441f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1321, 30, 2.2710068130204393, 379.82134746404233, 100, 3191, 123.0, 1100.6, 1256.5999999999995, 1731.0, 5.236971991516184, 771.7348677624929, 3.817267810065611], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 57, 0, 0.0, 1678.9298245614034, 1224, 2153, 1669.0, 2005.2, 2094.3999999999996, 2153.0, 0.2507202709538367, 301.6992861894917, 1.2327896135278982], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d315e107-2bf0-4efa-a6ba-8c4f7c43a811", 1, 0, 0.0, 583.0, 583, 583, 583.0, 583.0, 583.0, 583.0, 1.7152658662092624, 0.3098868996569468, 1.182595411663808], "isController": false}, {"data": ["deleteBook", 16, 4, 25.0, 493.8749999999999, 105, 971, 468.5, 961.9, 971.0, 971.0, 0.10822437618793164, 0.02264362558424253, 0.0722640793149397], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 4, 25.0, 493.8749999999999, 105, 971, 468.5, 961.9, 971.0, 971.0, 0.10748354158269516, 0.022488621859465267, 0.07176940581754668], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 13, 0, 0.0, 149.38461538461542, 100, 307, 102.0, 306.6, 307.0, 307.0, 0.07994440788866819, 0.030627740402058876, 0.04507682734467724], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 13, 0, 0.0, 103.76923076923076, 101, 114, 102.0, 112.0, 114.0, 114.0, 0.08004186805405904, 0.05948423983314349, 0.04017726580057261], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 13, 0, 0.0, 204.61538461538458, 102, 803, 104.0, 602.9999999999998, 803.0, 803.0, 0.079699838148021, 1.8224752202474375, 0.046405757623596056], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 13, 0, 0.0, 179.69230769230768, 101, 904, 103.0, 663.1999999999998, 904.0, 904.0, 0.07965100605347646, 5.532902806242801, 0.04629954062814009], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=24406bd3-1c61-49cd-b643-51162626c94d", 1, 0, 0.0, 1345.0, 1345, 1345, 1345.0, 1345.0, 1345.0, 1345.0, 0.7434944237918215, 0.13432272304832715, 0.5126045539033457], "isController": false}, {"data": ["goToProfile", 16, 4, 25.0, 224.56249999999997, 101, 499, 195.5, 422.70000000000005, 499.0, 499.0, 0.10873849750581072, 0.18682128700506995, 0.07027119211374047], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/892ca156-4869-4fe8-922d-30a783142142", 3, 0, 0.0, 757.6666666666667, 254, 1629, 390.0, 1629.0, 1629.0, 1629.0, 0.023138328641394472, 0.02734872112529405, 0.014838055801935906], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 15, 0, 0.0, 104.13333333333333, 101, 111, 104.0, 109.8, 111.0, 111.0, 0.08254275714820278, 0.06134281073220929, 0.04143259489665647], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 15, 0, 0.0, 103.4, 101, 108, 103.0, 106.8, 108.0, 108.0, 0.08254094030639197, 0.022086150042921287, 0.04707413001848917], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 7, 0, 0.0, 675.5714285714286, 599, 807, 607.0, 807.0, 807.0, 807.0, 0.06340177706123706, 18.64222759313268, 0.03615882598023676], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 7, 0, 0.0, 1155.0, 1012, 1230, 1194.0, 1230.0, 1230.0, 1230.0, 0.06311139160618491, 56.78774110523824, 0.03593158330703692], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 7, 0, 0.0, 236.14285714285714, 102, 429, 300.0, 429.0, 429.0, 429.0, 0.06369136981938948, 0.11270386925071653, 0.03526660809335335], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 7, 0, 0.0, 104.71428571428571, 102, 115, 103.0, 115.0, 115.0, 115.0, 0.048210030441190654, 0.03582796207592391, 0.024199175436300773], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 7, 0, 0.0, 160.57142857142856, 101, 309, 104.0, 309.0, 309.0, 309.0, 0.04821069450949062, 0.03358875674949723, 0.02633832027053087], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 7, 0, 0.0, 417.0, 100, 1208, 103.0, 1208.0, 1208.0, 1208.0, 0.04784819817356592, 12.310324081827256, 0.026954662977798437], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 7, 0, 0.0, 348.4285714285714, 101, 911, 104.0, 911.0, 911.0, 911.0, 0.04794356357658984, 4.03694436834355, 0.02705520572925585], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2bc6fabb-dc98-482d-a5b5-8356d3a18034", 3, 0, 0.0, 644.0, 191, 1344, 397.0, 1344.0, 1344.0, 1344.0, 0.020126528777581733, 0.027746044717792524, 0.012906660706977869], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 7, 0, 0.0, 106.28571428571429, 102, 110, 108.0, 110.0, 110.0, 110.0, 0.06369194933760372, 0.04733356781827777, 0.035764522333127095], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 18, 0, 0.0, 656.9444444444445, 102, 1253, 857.5, 1214.3, 1253.0, 1253.0, 0.10119238358659538, 50.59716902009231, 0.05465882004058939], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 15, 0, 0.0, 130.60000000000002, 101, 312, 103.0, 309.6, 312.0, 312.0, 0.08254184871729967, 0.022247607662084678, 0.04852557903106875], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 18, 0, 0.0, 485.61111111111103, 102, 844, 601.5, 824.2, 844.0, 844.0, 0.10119295247304333, 16.54217093316768, 0.054757948565871], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 15, 0, 0.0, 168.86666666666667, 101, 471, 103.0, 372.6, 471.0, 471.0, 0.08254230293025175, 0.02224773008666942, 0.04860645377631036], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a92cf8b8-ba28-4869-90f2-db9785637f1c", 3, 0, 0.0, 441.6666666666667, 375, 513, 437.0, 513.0, 513.0, 513.0, 0.028740587457607634, 0.02395984520798605, 0.018430650159989268], "isController": false}, {"data": ["deleteBooks", 16, 4, 25.0, 508.43749999999994, 105, 1345, 531.0, 1096.5000000000002, 1345.0, 1345.0, 0.10720555324765824, 0.02243045877276443, 0.07200255785749701], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d9f4a558-3a27-46b5-a066-212f52f323ae", 1, 0, 0.0, 468.0, 468, 468, 468.0, 468.0, 468.0, 468.0, 2.136752136752137, 0.38603432158119655, 1.473190438034188], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 7, 0, 0.0, 624.7142857142857, 206, 1311, 425.0, 1311.0, 1311.0, 1311.0, 0.04781388105272505, 16.396365707457598, 0.10403921634756592], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2bc6fabb-dc98-482d-a5b5-8356d3a18034", 1, 0, 0.0, 990.0, 990, 990, 990.0, 990.0, 990.0, 990.0, 1.0101010101010102, 0.18248895202020202, 0.696417297979798], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1d15d3ca-4523-42ed-937e-65b7396c666d", 1, 0, 0.0, 219.0, 219, 219, 219.0, 219.0, 219.0, 219.0, 4.5662100456621, 0.8249500570776256, 3.148187785388128], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3cad325d-8dbc-4789-8263-5cc7cdb9f022", 1, 0, 0.0, 1188.0, 1188, 1188, 1188.0, 1188.0, 1188.0, 1188.0, 0.8417508417508417, 0.2688012941919192, 0.5022556292087542], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 24, 0, 0.0, 473.41666666666674, 131, 1206, 438.0, 928.5, 1167.75, 1206.0, 0.11347356775081205, 0.06970202550318436, 0.05130689635608006], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 18, 0, 0.0, 105.11111111111111, 102, 124, 104.0, 109.60000000000002, 124.0, 124.0, 0.1011906769656289, 0.07520127458090195, 0.05079297652376294], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 18, 0, 0.0, 217.1111111111111, 101, 413, 206.0, 409.4, 413.0, 413.0, 0.10119238358659538, 0.11151365534998511, 0.05298984843629659], "isController": false}, {"data": ["login", 24, 0, 0.0, 2862.708333333333, 1684, 5189, 2717.5, 4047.5, 4947.75, 5189.0, 0.11109413839552292, 38.915472947130766, 0.22134747642721253], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 15, 0, 0.0, 144.4666666666667, 103, 433, 108.0, 359.20000000000005, 433.0, 433.0, 0.08443188598318117, 0.06835354832036836, 0.030012896970583933], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7f9dce26-b79d-403d-9fcd-6d2ff556fc8f", 1, 0, 0.0, 561.0, 561, 561, 561.0, 561.0, 561.0, 561.0, 1.7825311942959001, 0.32203932709447414, 1.2289717023172904], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/656288ed-13be-4a70-8f47-170e71194c4f", 3, 0, 0.0, 889.3333333333334, 211, 2062, 395.0, 2062.0, 2062.0, 2062.0, 0.020720950953509093, 0.0285655036745153, 0.013287849407035453], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 18, 0, 0.0, 774.6111111111111, 207, 1358, 962.0, 1320.2, 1358.0, 1358.0, 0.10113211787510183, 67.28586678652695, 0.21307316978958898], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f53caa46-ebe0-4bd2-a778-ae7d9963147b", 1, 0, 0.0, 590.0, 590, 590, 590.0, 590.0, 590.0, 590.0, 1.694915254237288, 0.3062102754237288, 1.168564618644068], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a3093efe-79c6-4519-8cba-3560412c504a", 1, 0, 0.0, 482.0, 482, 482, 482.0, 482.0, 482.0, 482.0, 2.074688796680498, 0.6625226919087137, 1.2379246628630707], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 13, 0, 0.0, 364.23076923076917, 206, 1007, 403.0, 768.5999999999998, 1007.0, 1007.0, 0.07959882193743532, 7.439093507185325, 0.17745299268609288], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 15, 8, 53.333333333333336, 644.2666666666667, 101, 1334, 110.0, 1327.4, 1334.0, 1334.0, 0.13511200785451138, 75.45171744250983, 0.18992209385330439], "isController": false}, {"data": ["register", 25, 7, 28.0, 1183.0000000000002, 145, 3085, 1328.0, 1805.8000000000004, 2733.099999999999, 3085.0, 0.10700268362730538, 0.033638968665334126, 0.048276601402163166], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/b5b3858c-0d3c-4bf5-afbc-629bbd5ba51a", 1, 0, 0.0, 334.0, 334, 334, 334.0, 334.0, 334.0, 334.0, 2.9940119760479043, 0.9560956212574849, 1.7864661302395208], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c33a75b8-9b3f-4430-aaf8-cb2b093a441f", 3, 0, 0.0, 458.6666666666667, 193, 694, 489.0, 694.0, 694.0, 694.0, 0.031832940727064364, 0.026537812891279895, 0.02041370222406146], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 21, 0, 0.0, 136.42857142857144, 102, 307, 108.0, 306.8, 307.0, 307.0, 0.10338308849592374, 0.08026323765064393, 0.0367494572387854], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 15, 0, 0.0, 301.73333333333335, 205, 581, 212.0, 484.4000000000001, 581.0, 581.0, 0.08249509154205326, 0.12785127956761572, 0.18553339435678576], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f53caa46-ebe0-4bd2-a778-ae7d9963147b", 3, 0, 0.0, 666.0, 198, 1480, 320.0, 1480.0, 1480.0, 1480.0, 0.021954539466943784, 0.02594952239728935, 0.01407892016597632], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 0, 0.0, 446.06249999999994, 204, 1311, 408.5, 1243.1000000000001, 1311.0, 1311.0, 0.07066263889624957, 10.662959431364495, 0.1566619687052838], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 12, 0, 0.0, 103.83333333333336, 102, 107, 103.5, 106.7, 107.0, 107.0, 0.06105130344532855, 0.04537113468935061, 0.030644892549705934], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 12, 0, 0.0, 157.41666666666669, 101, 306, 103.5, 305.1, 306.0, 306.0, 0.06105285651052399, 0.023977952923159893, 0.03439191672899146], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d315e107-2bf0-4efa-a6ba-8c4f7c43a811", 3, 0, 0.0, 980.3333333333334, 312, 1573, 1056.0, 1573.0, 1573.0, 1573.0, 0.02916103696647453, 0.024310356663782964, 0.018700274356756127], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 12, 0, 0.0, 195.0, 101, 1009, 103.0, 798.1000000000008, 1009.0, 1009.0, 0.06105316713304502, 4.593063350610532, 0.03545535487153396], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 12, 0, 0.0, 179.33333333333331, 101, 808, 103.0, 658.6000000000006, 808.0, 808.0, 0.06105254589116366, 1.5110405738684929, 0.035514615725100736], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 4, 4, 100.0, 118.25, 105, 154, 107.0, 154.0, 154.0, 154.0, 0.07960991143397353, 0.023478704348691412, 0.04921198626729028], "isController": false}, {"data": ["https://demoqa.com/books", 57, 0, 0.0, 1150.1228070175434, 805, 1731, 1113.0, 1565.8000000000002, 1652.4999999999998, 1731.0, 0.24820919244921508, 296.94448564632364, 0.4901161983713993], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 7, 28.0, 1183.0000000000002, 145, 3085, 1328.0, 1805.8000000000004, 2733.099999999999, 3085.0, 0.10634722795315618, 0.03343290978777347, 0.04798087823667788], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 11, 0, 0.0, 143.45454545454544, 101, 306, 105.0, 306.0, 306.0, 306.0, 0.05719663683775394, 0.015416281022675867, 0.03368122266910706], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 11, 0, 0.0, 107.81818181818183, 101, 133, 104.0, 128.8, 133.0, 133.0, 0.05719574463659904, 0.015416040546583335, 0.03362484206175061], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/24406bd3-1c61-49cd-b643-51162626c94d", 3, 0, 0.0, 893.0, 190, 2093, 396.0, 2093.0, 2093.0, 2093.0, 0.04977105315548477, 0.03096109458988652, 0.03191698395713053], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 21, 0, 0.0, 179.52380952380958, 101, 900, 104.0, 305.0, 840.4999999999992, 900.0, 0.10294016725326223, 4.437174061099891, 0.060096301139204514], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cff5e4dd-d4fd-4952-a017-fc35cae5f000", 1, 0, 0.0, 464.0, 464, 464, 464.0, 464.0, 464.0, 464.0, 2.155172413793103, 0.3893622036637931, 1.4858903556034482], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 21, 0, 0.0, 184.2380952380952, 101, 807, 103.0, 305.8, 756.8999999999993, 807.0, 0.10304270384054877, 1.4692114687756073, 0.06025678947148906], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 21, 0, 0.0, 105.42857142857143, 101, 122, 104.0, 113.4, 121.19999999999999, 122.0, 0.10303613133672208, 0.07657274994848193, 0.05171930811237807], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 11, 0, 0.0, 141.09090909090907, 101, 306, 104.0, 305.2, 306.0, 306.0, 0.05720526288418534, 0.015306876982682408, 0.032624876488636954], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 21, 0, 0.0, 112.66666666666667, 101, 311, 103.0, 106.4, 290.5999999999997, 311.0, 0.10304219823356232, 0.03494157875368008, 0.05835416155544651], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 11, 0, 0.0, 140.8181818181818, 103, 306, 103.0, 305.8, 306.0, 306.0, 0.05720407292999261, 0.04251201123019959, 0.0287137631699377], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 11, 0, 0.0, 179.63636363636363, 103, 320, 107.0, 317.40000000000003, 320.0, 320.0, 0.05773005426625101, 0.04543986693222492, 0.020521230227456413], "isController": false}, {"data": ["deleteAccount", 16, 4, 25.0, 608.875, 102, 1629, 439.5, 1524.7, 1629.0, 1629.0, 0.10550957829140425, 0.02135435556727884, 0.07179081901810148], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/78298e2b-01cd-479c-8616-125b7e785cda", 1, 0, 0.0, 253.0, 253, 253, 253.0, 253.0, 253.0, 253.0, 3.952569169960474, 1.2621973814229248, 2.3584177371541504], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 24, 0, 0.0, 1534.666666666667, 789, 3191, 1323.0, 2626.0, 3120.0, 3191.0, 0.11101705499507362, 0.057459999167372086, 0.051063508694023124], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 11, 0, 0.0, 286.8181818181818, 208, 613, 214.0, 612.6, 613.0, 613.0, 0.05716453512241006, 0.0885938644914695, 0.12856437928409215], "isController": false}, {"data": ["addBook", 56, 7, 12.5, 1114.25, 528, 2468, 866.5, 1756.8, 1972.2499999999998, 2468.0, 0.26544939159947484, 97.51087868488787, 0.9610088247109683], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/d9f4a558-3a27-46b5-a066-212f52f323ae", 3, 0, 0.0, 402.0, 196, 511, 499.0, 511.0, 511.0, 511.0, 0.02835645960149722, 0.023639613619607546, 0.01818431816892888], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7f9dce26-b79d-403d-9fcd-6d2ff556fc8f", 3, 0, 0.0, 334.6666666666667, 225, 403, 376.0, 403.0, 403.0, 403.0, 0.04354578839649892, 0.027995746120796017, 0.02792487081416109], "isController": false}, {"data": ["https://demoqa.com/books-0", 57, 0, 0.0, 182.54385964912274, 102, 627, 104.0, 414.8, 422.29999999999995, 627.0, 0.24908232826428947, 0.18510903496984793, 0.1204060082918196], "isController": false}, {"data": ["https://demoqa.com/books-3", 57, 0, 0.0, 660.1754385964913, 497, 934, 610.0, 824.0, 916.6999999999999, 934.0, 0.2489300375578653, 73.1936962971657, 0.12519430599834047], "isController": false}, {"data": ["https://demoqa.com/books-1", 57, 0, 0.0, 166.98245614035085, 101, 417, 104.0, 309.0, 322.1999999999994, 417.0, 0.24969554665802227, 0.44184407279720345, 0.12143396702704598], "isController": false}, {"data": ["https://demoqa.com/books-2", 57, 0, 0.0, 960.1403508771932, 702, 1318, 1002.0, 1215.4, 1235.6999999999996, 1318.0, 0.2490420618935061, 224.0884850610262, 0.12500744122388882], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 16, 0, 0.0, 106.5, 103, 113, 105.5, 112.3, 113.0, 113.0, 0.07348483456726618, 0.05489833832417835, 0.0261215622875829], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a92cf8b8-ba28-4869-90f2-db9785637f1c", 1, 0, 0.0, 512.0, 512, 512, 512.0, 512.0, 512.0, 512.0, 1.953125, 0.3528594970703125, 1.346588134765625], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 169, 7, 4.1420118343195265, 175.85207100591717, 102, 1856, 109.0, 309.0, 410.0, 974.0000000000143, 0.6874613557226072, 1.6020055108773472, 0.32743954077378046], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 12, 0, 0.0, 119.0, 104, 255, 106.0, 213.00000000000014, 255.0, 255.0, 0.06102367209946858, 0.04725758981921737, 0.02169200844160797], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=892ca156-4869-4fe8-922d-30a783142142", 1, 0, 0.0, 688.0, 688, 688, 688.0, 688.0, 688.0, 688.0, 1.4534883720930232, 0.26259311409883723, 1.0021121002906979], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 13, 0, 0.0, 108.61538461538461, 104, 129, 105.0, 123.39999999999999, 129.0, 129.0, 0.0764076642764782, 0.06200661036499354, 0.02716053691077936], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 12, 0, 0.0, 338.4166666666667, 206, 1113, 212.0, 903.6000000000008, 1113.0, 1113.0, 0.061019017593816734, 6.1700168199557615, 0.1359321767263297], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 21, 0, 0.0, 305.57142857142856, 205, 1004, 215.0, 411.6, 944.7999999999992, 1004.0, 0.10288217051984891, 6.012942332093848, 0.2301309190929712], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=656288ed-13be-4a70-8f47-170e71194c4f", 1, 0, 0.0, 692.0, 692, 692, 692.0, 692.0, 692.0, 692.0, 1.445086705202312, 0.2610752348265896, 0.9963195447976879], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1d15d3ca-4523-42ed-937e-65b7396c666d", 3, 0, 0.0, 395.0, 203, 540, 442.0, 540.0, 540.0, 540.0, 0.09062075215224287, 0.04011856215073252, 0.058112917233046374], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 7, 0, 0.0, 108.0, 104, 113, 106.0, 113.0, 113.0, 113.0, 0.04859896137076842, 0.04029347480838124, 0.017275412049765335], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cff5e4dd-d4fd-4952-a017-fc35cae5f000", 3, 0, 0.0, 333.6666666666667, 189, 442, 370.0, 442.0, 442.0, 442.0, 0.03934581032696368, 0.02529556490747177, 0.025231525502642727], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 18, 0, 0.0, 120.33333333333331, 103, 306, 106.5, 143.10000000000025, 306.0, 306.0, 0.10386972428358743, 0.08064104570844922, 0.036922441053931464], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/74df1d49-3194-45b5-90aa-18a2d555b82b", 1, 0, 0.0, 337.0, 337, 337, 337.0, 337.0, 337.0, 337.0, 2.967359050445104, 0.947584384272997, 1.7705628709198813], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c33a75b8-9b3f-4430-aaf8-cb2b093a441f", 1, 0, 0.0, 550.0, 550, 550, 550.0, 550.0, 550.0, 550.0, 1.8181818181818181, 0.3284801136363636, 1.2535511363636362], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 16, 0, 0.0, 129.9375, 101, 314, 105.0, 307.7, 314.0, 314.0, 0.07069510966578887, 0.05253806489811067, 0.03548563121896043], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 16, 0, 0.0, 140.81249999999997, 102, 305, 103.0, 305.0, 305.0, 305.0, 0.07069604676543494, 0.03218948418396879, 0.039576668758091384], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 16, 0, 0.0, 302.125, 101, 1205, 203.0, 997.8000000000002, 1205.0, 1205.0, 0.07069604676543494, 7.968226338364535, 0.040802112928097704], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 16, 0, 0.0, 259.5625, 101, 807, 203.0, 675.4000000000001, 807.0, 807.0, 0.07069635913750442, 2.6150576341021563, 0.040871332626369744], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 23.333333333333332, 0.5299015897047691], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 4, 13.333333333333334, 0.3028009084027252], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 4, 13.333333333333334, 0.3028009084027252], "isController": false}, {"data": ["401/Unauthorized", 15, 50.0, 1.1355034065102196], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1321, 30, "401/Unauthorized", 15, "406/Not Acceptable", 7, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 4, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 15, 8, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 4, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 4, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 169, 7, "401/Unauthorized", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
