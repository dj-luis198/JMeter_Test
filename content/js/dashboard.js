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

    var data = {"OkPercent": 98.74902267396403, "KoPercent": 1.2509773260359656};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7992577597840755, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.1388888888888889, 500, 1500, "see books"], "isController": true}, {"data": [0.6538461538461539, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6538461538461539, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9761904761904762, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9761904761904762, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b1fb0aa6-8292-4613-978f-0124e9cfddce"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/84da7bb2-cd0f-41aa-a809-22c38db5ab41"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6153846153846154, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6153846153846154, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6538461538461539, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bef9d071-9327-430c-892f-8be732b17c44"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cdadefa0-4972-4a4e-8d19-a1f3133d7021"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b71a2931-3189-4e4b-82d5-9f718fae7152"], "isController": false}, {"data": [0.7631578947368421, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c2f76064-ae1d-4b3f-ba01-8732b37fef5d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f81dbf02-7719-425d-ba81-661ed8de1bee"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8aa8e88c-ecbe-414e-8dc0-350deebf81b2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/9fea795e-c393-442b-88a6-e02c862a521b"], "isController": false}, {"data": [0.5769230769230769, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/352f56d8-a331-4c19-840e-58ba9e4044e2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=39f78526-760c-493c-8ef5-af3b68d2ca37"], "isController": false}, {"data": [0.8809523809523809, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.375, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c6efc243-9125-42fc-8a4b-428c2748ba05"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=33ec0898-7b77-4ffd-af45-8e5f08446e64"], "isController": false}, {"data": [0.34210526315789475, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8611111111111112, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.49074074074074076, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.34210526315789475, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.75, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.42105263157894735, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/cdadefa0-4972-4a4e-8d19-a1f3133d7021"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8aa8e88c-ecbe-414e-8dc0-350deebf81b2"], "isController": false}, {"data": [0.35, 500, 1500, "addBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b1fb0aa6-8292-4613-978f-0124e9cfddce"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b71a2931-3189-4e4b-82d5-9f718fae7152"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/bef9d071-9327-430c-892f-8be732b17c44"], "isController": false}, {"data": [0.5092592592592593, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9597701149425287, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/33ec0898-7b77-4ffd-af45-8e5f08446e64"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f81dbf02-7719-425d-ba81-661ed8de1bee"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c2f76064-ae1d-4b3f-ba01-8732b37fef5d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=352f56d8-a331-4c19-840e-58ba9e4044e2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9fea795e-c393-442b-88a6-e02c862a521b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c6efc243-9125-42fc-8a4b-428c2748ba05"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/39f78526-760c-493c-8ef5-af3b68d2ca37"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1279, 16, 1.2509773260359656, 334.42142298670854, 99, 2102, 120.0, 851.0, 1020.0, 1370.400000000001, 5.018756572648366, 688.6278269132293, 3.6855075739962486], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 54, 0, 0.0, 1594.0370370370367, 1265, 2018, 1583.5, 1820.5, 1900.75, 2018.0, 0.2410703523644984, 290.0908288007085, 1.1853410392141106], "isController": true}, {"data": ["deleteBook", 13, 1, 7.6923076923076925, 533.2307692307692, 123, 819, 552.0, 811.4, 819.0, 819.0, 0.08653801348661656, 0.016394897086331652, 0.05850026918314771], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, 7.6923076923076925, 533.2307692307692, 123, 819, 552.0, 811.4, 819.0, 819.0, 0.08617375280064696, 0.01632588676106007, 0.05825402655145898], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 21, 0, 0.0, 161.0476190476191, 102, 334, 113.0, 324.6, 333.09999999999997, 334.0, 0.10049818385424893, 0.03407890423480204, 0.056913452519393753], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 21, 0, 0.0, 150.14285714285714, 107, 346, 113.0, 312.8, 342.9, 346.0, 0.10049481733870583, 0.07468413671362806, 0.05044368760946757], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 21, 0, 0.0, 189.66666666666669, 101, 545, 111.0, 333.0, 523.7999999999997, 545.0, 0.10049866480345332, 1.4329378541381521, 0.058769099232860195], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 21, 0, 0.0, 218.23809523809524, 103, 937, 113.0, 334.4, 876.8999999999992, 937.0, 0.10049818385424893, 4.331913833874109, 0.058670675228154806], "isController": false}, {"data": ["goToProfile", 13, 1, 7.6923076923076925, 298.15384615384613, 111, 483, 239.0, 472.2, 483.0, 483.0, 0.0875079093687314, 0.22360137749229259, 0.056565922484820744], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/b1fb0aa6-8292-4613-978f-0124e9cfddce", 3, 0, 0.0, 526.0, 205, 925, 448.0, 925.0, 925.0, 925.0, 0.01593151572440602, 0.021962880564081865, 0.01021649934149735], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 18, 0, 0.0, 169.16666666666666, 103, 336, 109.0, 335.1, 336.0, 336.0, 0.09335663791627984, 0.06937929829520406, 0.04686065614157016], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 18, 0, 0.0, 169.11111111111111, 101, 341, 107.5, 337.4, 341.0, 341.0, 0.0932420252167877, 0.024949526278710776, 0.05317709250644924], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 675.6666666666666, 526, 755, 741.5, 755.0, 755.0, 755.0, 0.10585931297305881, 31.126152874080347, 0.0603728894299476], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 890.3333333333334, 689, 1009, 934.5, 1009.0, 1009.0, 1009.0, 0.10551862403714256, 94.94584339057718, 0.06007554473989659], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 180.0, 106, 332, 112.5, 332.0, 332.0, 332.0, 0.10708166761850371, 0.18948435715305542, 0.059292290566105084], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 17, 0, 0.0, 110.58823529411767, 104, 115, 112.0, 115.0, 115.0, 115.0, 0.0839497881502405, 0.06238846560774708, 0.042138858505101184], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 17, 0, 0.0, 120.0, 101, 298, 110.0, 150.79999999999987, 298.0, 298.0, 0.08394937358952706, 0.029879958568515035, 0.04746264561512669], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 17, 0, 0.0, 154.82352941176472, 102, 911, 107.0, 272.59999999999945, 911.0, 911.0, 0.08395061728395062, 4.464761766975308, 0.048929398148148145], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 17, 0, 0.0, 175.8235294117647, 102, 822, 109.0, 429.99999999999966, 822.0, 822.0, 0.08395061728395062, 1.473312114197531, 0.049011381172839506], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/84da7bb2-cd0f-41aa-a809-22c38db5ab41", 1, 0, 0.0, 291.0, 291, 291, 291.0, 291.0, 291.0, 291.0, 3.4364261168384878, 1.0973743556701032, 2.0504456615120277], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 144.33333333333334, 100, 324, 110.5, 324.0, 324.0, 324.0, 0.10707975657202007, 0.0795778269055735, 0.06012779299698392], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 13, 0, 0.0, 787.6153846153846, 104, 1166, 942.0, 1154.8, 1166.0, 1166.0, 0.0789635127829779, 54.659917342665196, 0.04120196512849793], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 18, 0, 0.0, 144.55555555555557, 105, 324, 110.5, 320.4, 324.0, 324.0, 0.09335421701743649, 0.02516187880548093, 0.05488206898876638], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 13, 0, 0.0, 602.3846153846154, 103, 902, 759.0, 894.0, 902.0, 902.0, 0.07896399241945672, 17.86493892438894, 0.04127932866939599], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 18, 0, 0.0, 158.83333333333334, 101, 348, 110.5, 340.8, 348.0, 348.0, 0.09324299123515882, 0.0251318999813514, 0.05490773800273512], "isController": false}, {"data": ["deleteBooks", 13, 1, 7.6923076923076925, 568.2307692307693, 113, 1185, 518.0, 1047.3999999999999, 1185.0, 1185.0, 0.08619375029007513, 0.01632967534792439, 0.058953883442843594], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bef9d071-9327-430c-892f-8be732b17c44", 1, 0, 0.0, 445.0, 445, 445, 445.0, 445.0, 445.0, 445.0, 2.247191011235955, 0.4059866573033708, 1.5493328651685394], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cdadefa0-4972-4a4e-8d19-a1f3133d7021", 1, 0, 0.0, 445.0, 445, 445, 445.0, 445.0, 445.0, 445.0, 2.247191011235955, 0.4059866573033708, 1.5493328651685394], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 17, 0, 0.0, 305.47058823529414, 213, 1023, 224.0, 554.9999999999995, 1023.0, 1023.0, 0.0839037968935853, 6.026980160453673, 0.18743880729518836], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b71a2931-3189-4e4b-82d5-9f718fae7152", 1, 0, 0.0, 719.0, 719, 719, 719.0, 719.0, 719.0, 719.0, 1.3908205841446453, 0.25127129694019473, 0.9589055980528512], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 19, 0, 0.0, 491.0526315789474, 197, 1191, 486.0, 698.0, 1191.0, 1191.0, 0.08379087561465018, 0.05146919996251461, 0.03788591348592093], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 13, 0, 0.0, 111.0, 105, 127, 110.0, 121.8, 127.0, 127.0, 0.07895919631685717, 0.05867963710657062, 0.03963381533873495], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c2f76064-ae1d-4b3f-ba01-8732b37fef5d", 1, 0, 0.0, 613.0, 613, 613, 613.0, 613.0, 613.0, 613.0, 1.6313213703099512, 0.29472114600326266, 1.124719616639478], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 13, 0, 0.0, 186.84615384615387, 104, 421, 112.0, 391.0, 421.0, 421.0, 0.07881176113973931, 0.1121433578357078, 0.03985582752349197], "isController": false}, {"data": ["login", 19, 0, 0.0, 2414.0, 1559, 3367, 2366.0, 3078.0, 3367.0, 3367.0, 0.0834288373971959, 31.631570295381994, 0.16956345174739504], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/f81dbf02-7719-425d-ba81-661ed8de1bee", 3, 0, 0.0, 308.0, 209, 478, 237.0, 478.0, 478.0, 478.0, 0.05822190307993867, 0.03743107375744755, 0.03733631154540338], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 18, 0, 0.0, 112.66666666666669, 108, 124, 112.0, 117.70000000000002, 124.0, 124.0, 0.09421173564186978, 0.07627102426475592, 0.033489327903945904], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8aa8e88c-ecbe-414e-8dc0-350deebf81b2", 1, 0, 0.0, 652.0, 652, 652, 652.0, 652.0, 652.0, 652.0, 1.5337423312883436, 0.277092120398773, 1.0574434432515336], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9fea795e-c393-442b-88a6-e02c862a521b", 3, 0, 0.0, 799.6666666666666, 217, 1257, 925.0, 1257.0, 1257.0, 1257.0, 0.017671799342609065, 0.02088746855892367, 0.011332501531555943], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 13, 0, 0.0, 934.0769230769231, 213, 1277, 1051.0, 1265.8, 1277.0, 1277.0, 0.07875780762496744, 72.50641256103731, 0.16162744489982614], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/352f56d8-a331-4c19-840e-58ba9e4044e2", 3, 0, 0.0, 944.6666666666666, 295, 2102, 437.0, 2102.0, 2102.0, 2102.0, 0.027445634771789545, 0.022880296435726897, 0.017600228027482227], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=39f78526-760c-493c-8ef5-af3b68d2ca37", 1, 0, 0.0, 1185.0, 1185, 1185, 1185.0, 1185.0, 1185.0, 1185.0, 0.8438818565400844, 0.15245912447257384, 0.5818169831223629], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 21, 0, 0.0, 414.28571428571433, 217, 1047, 436.0, 659.2, 1008.4999999999994, 1047.0, 0.1004419445560466, 5.870323470890968, 0.22467252488329603], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 2, 25.0, 812.5, 111, 1297, 977.0, 1297.0, 1297.0, 1297.0, 0.11787761356771331, 105.77484040476224, 0.21887651122784268], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c6efc243-9125-42fc-8a4b-428c2748ba05", 3, 0, 0.0, 634.6666666666666, 347, 1111, 446.0, 1111.0, 1111.0, 1111.0, 0.07830036018165683, 0.03537789711332672, 0.05021214503836718], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=33ec0898-7b77-4ffd-af45-8e5f08446e64", 1, 0, 0.0, 428.0, 428, 428, 428.0, 428.0, 428.0, 428.0, 2.336448598130841, 0.4221122955607477, 1.6108717873831777], "isController": false}, {"data": ["register", 19, 6, 31.57894736842105, 748.6842105263157, 160, 1599, 820.0, 1266.0, 1599.0, 1599.0, 0.08710761458089776, 0.027274855470128964, 0.03930050579724098], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 16, 0, 0.0, 158.12500000000003, 104, 370, 116.0, 349.0, 370.0, 370.0, 0.07565441065214103, 0.058735602019972764, 0.026892778786503254], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 18, 0, 0.0, 366.77777777777777, 214, 671, 223.5, 670.1, 671.0, 671.0, 0.09319181982914833, 0.14442911920786952, 0.20959058697903182], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 14, 0, 0.0, 349.1428571428571, 217, 452, 433.0, 451.5, 452.0, 452.0, 0.09080060187827531, 0.14072319841877237, 0.2042126817633477], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 7, 0, 0.0, 170.0, 108, 322, 112.0, 322.0, 322.0, 322.0, 0.04283257968389556, 0.03183163392523879, 0.02149994722414289], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 7, 0, 0.0, 106.14285714285715, 100, 113, 106.0, 113.0, 113.0, 113.0, 0.04283362806948838, 0.020651927819217614, 0.023914645582323174], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 7, 0, 0.0, 258.85714285714283, 103, 938, 110.0, 938.0, 938.0, 938.0, 0.04283310387027688, 5.51579590217225, 0.024655327367293863], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 7, 0, 0.0, 268.2857142857143, 107, 767, 114.0, 767.0, 767.0, 767.0, 0.04283284177548248, 1.8090780575000307, 0.024697005448949372], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 113.0, 113, 113, 113.0, 113.0, 113.0, 113.0, 8.849557522123893, 2.609928097345133, 5.470478429203539], "isController": false}, {"data": ["https://demoqa.com/books", 54, 0, 0.0, 1024.9074074074076, 811, 1561, 897.0, 1377.0, 1448.5, 1561.0, 0.24180439815333088, 289.2821250016792, 0.4774692315097998], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 19, 6, 31.57894736842105, 748.6842105263157, 160, 1599, 820.0, 1266.0, 1599.0, 1599.0, 0.08393227107473064, 0.026280602147782644, 0.037867880113794494], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 8, 0, 0.0, 109.25, 106, 112, 109.5, 112.0, 112.0, 112.0, 0.03747827431285926, 0.01010156612338785, 0.02206972598696693], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 8, 0, 0.0, 132.875, 99, 325, 106.0, 325.0, 325.0, 325.0, 0.03747862547141084, 0.0101016607715912, 0.022033332552528633], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 16, 0, 0.0, 137.75, 106, 341, 111.5, 324.20000000000005, 341.0, 341.0, 0.07858353183860907, 0.021180717565875102, 0.04619852164730729], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 16, 0, 0.0, 150.4375, 104, 337, 111.0, 325.8, 337.0, 337.0, 0.07858661964567258, 0.021181549826372686, 0.046277081685879455], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 16, 0, 0.0, 136.125, 105, 321, 112.0, 309.1, 321.0, 321.0, 0.07858546168958742, 0.058401890962671905, 0.03944621807465619], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 8, 0, 0.0, 160.125, 105, 321, 110.5, 321.0, 321.0, 321.0, 0.037442841162787434, 0.010018885233011482, 0.02135412035065221], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 16, 0, 0.0, 121.4375, 101, 322, 108.0, 178.50000000000014, 322.0, 322.0, 0.0785873916353545, 0.02102826690242884, 0.04481937179203811], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 8, 0, 0.0, 139.375, 108, 342, 110.5, 342.0, 342.0, 342.0, 0.03747722087668589, 0.0278517237179277, 0.018811808135367723], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 8, 0, 0.0, 114.5, 105, 136, 112.5, 136.0, 136.0, 136.0, 0.037844204869603056, 0.029787528442285223, 0.013452432199741713], "isController": false}, {"data": ["deleteAccount", 12, 1, 8.333333333333334, 597.6666666666666, 112, 1631, 455.0, 1518.8000000000004, 1631.0, 1631.0, 0.08280087768930351, 0.0155588563301271, 0.0563528434338904], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 19, 0, 0.0, 1154.6842105263156, 799, 1969, 1020.0, 1923.0, 1969.0, 1969.0, 0.08359254354511578, 0.04326567195206187, 0.03844930469702103], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 8, 0, 0.0, 302.12499999999994, 217, 667, 223.5, 667.0, 667.0, 667.0, 0.03742304885579028, 0.057998416537245294, 0.0841653139793799], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cdadefa0-4972-4a4e-8d19-a1f3133d7021", 2, 0, 0.0, 212.0, 211, 213, 212.0, 213.0, 213.0, 213.0, 0.016282004314731143, 0.023182775674685557, 0.010120601314771849], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8aa8e88c-ecbe-414e-8dc0-350deebf81b2", 3, 0, 0.0, 363.3333333333333, 202, 454, 434.0, 454.0, 454.0, 454.0, 0.021189583200898438, 0.02504536998778067, 0.013588372039638646], "isController": false}, {"data": ["addBook", 60, 6, 10.0, 1017.5666666666664, 555, 1875, 888.0, 1626.4, 1697.6, 1875.0, 0.26214381209531545, 68.9090236726785, 0.9570553139827509], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b1fb0aa6-8292-4613-978f-0124e9cfddce", 1, 0, 0.0, 841.0, 841, 841, 841.0, 841.0, 841.0, 841.0, 1.1890606420927465, 0.21482052615933414, 0.8198015755053508], "isController": false}, {"data": ["https://demoqa.com/books-0", 54, 0, 0.0, 194.51851851851856, 104, 495, 113.0, 434.5, 453.75, 495.0, 0.2426301103967002, 0.1803139785272352, 0.11728701625621739], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b71a2931-3189-4e4b-82d5-9f718fae7152", 3, 0, 0.0, 359.6666666666667, 209, 456, 414.0, 456.0, 456.0, 456.0, 0.0228171585031944, 0.02696910889488896, 0.014632097087009433], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bef9d071-9327-430c-892f-8be732b17c44", 3, 0, 0.0, 744.6666666666666, 430, 1250, 554.0, 1250.0, 1250.0, 1250.0, 0.018961899223826257, 0.026140508858367256, 0.012159811676737542], "isController": false}, {"data": ["https://demoqa.com/books-3", 54, 0, 0.0, 609.0925925925926, 490, 850, 550.5, 769.5, 800.25, 850.0, 0.24229480098174266, 71.24271643319618, 0.12185724854062252], "isController": false}, {"data": ["https://demoqa.com/books-1", 54, 0, 0.0, 179.0740740740741, 100, 432, 111.0, 333.5, 335.5, 432.0, 0.2427675500708072, 0.42958476633623305, 0.11806468743677928], "isController": false}, {"data": ["https://demoqa.com/books-2", 54, 0, 0.0, 824.9074074074073, 702, 1106, 778.5, 1002.0, 1021.0, 1106.0, 0.242306760358614, 218.02804890053307, 0.12162663557063241], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 14, 0, 0.0, 114.0, 110, 120, 114.0, 118.5, 120.0, 120.0, 0.09165602802055714, 0.06847349749582637, 0.03258085371043242], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 174, 6, 3.4482758620689653, 167.71264367816102, 105, 918, 115.0, 306.5, 345.5, 611.25, 0.7320397825757703, 1.4743755180022886, 0.3548940172576275], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 7, 0, 0.0, 112.85714285714286, 107, 115, 115.0, 115.0, 115.0, 115.0, 0.045023315645602184, 0.034866688776330604, 0.016004381733397653], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/33ec0898-7b77-4ffd-af45-8e5f08446e64", 3, 0, 0.0, 299.0, 227, 431, 239.0, 431.0, 431.0, 431.0, 0.017275334277718275, 0.02381544292517477, 0.01107825798408366], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 21, 0, 0.0, 125.57142857142857, 107, 327, 114.0, 156.80000000000004, 310.9999999999998, 327.0, 0.10210878962185711, 0.0828636759528938, 0.03629648381089452], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f81dbf02-7719-425d-ba81-661ed8de1bee", 1, 0, 0.0, 518.0, 518, 518, 518.0, 518.0, 518.0, 518.0, 1.9305019305019306, 0.3487723214285714, 1.3309905888030888], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 7, 0, 0.0, 463.42857142857144, 215, 1260, 227.0, 1260.0, 1260.0, 1260.0, 0.04280455440458865, 7.372451504732961, 0.09470388229664779], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 16, 0, 0.0, 303.625, 217, 644, 225.5, 641.9, 644.0, 644.0, 0.07854148463041323, 0.12172396104342362, 0.17664163974984537], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c2f76064-ae1d-4b3f-ba01-8732b37fef5d", 3, 0, 0.0, 378.6666666666667, 212, 468, 456.0, 468.0, 468.0, 468.0, 0.021444501629782124, 0.025346674940670215, 0.013751845120661063], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=352f56d8-a331-4c19-840e-58ba9e4044e2", 1, 0, 0.0, 437.0, 437, 437, 437.0, 437.0, 437.0, 437.0, 2.288329519450801, 0.41341890732265446, 1.577695938215103], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 17, 0, 0.0, 142.11764705882354, 105, 328, 114.0, 309.59999999999997, 328.0, 328.0, 0.08573690873053899, 0.07108460499240976, 0.03047679177530878], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 13, 0, 0.0, 126.69230769230771, 103, 320, 108.0, 241.19999999999993, 320.0, 320.0, 0.07491845414414311, 0.058164229535736106, 0.02663116924655087], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9fea795e-c393-442b-88a6-e02c862a521b", 1, 0, 0.0, 790.0, 790, 790, 790.0, 790.0, 790.0, 790.0, 1.2658227848101267, 0.22868868670886075, 0.8727254746835442], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c6efc243-9125-42fc-8a4b-428c2748ba05", 1, 0, 0.0, 201.0, 201, 201, 201.0, 201.0, 201.0, 201.0, 4.975124378109452, 0.8988261815920398, 3.4301150497512434], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 14, 0, 0.0, 111.07142857142856, 106, 115, 111.5, 115.0, 115.0, 115.0, 0.09086542830068668, 0.06752792083674078, 0.045610185689993116], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 14, 0, 0.0, 186.21428571428572, 104, 339, 111.5, 337.5, 339.0, 339.0, 0.09086837715568997, 0.02431438998111236, 0.05182337134660445], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/39f78526-760c-493c-8ef5-af3b68d2ca37", 3, 0, 0.0, 785.0, 241, 1631, 483.0, 1631.0, 1631.0, 1631.0, 0.018387986515476556, 0.021733977551333127, 0.011791775206864847], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 14, 0, 0.0, 171.14285714285714, 103, 343, 108.0, 340.0, 343.0, 343.0, 0.09087309572182448, 0.024493139081273003, 0.05342344103958821], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 14, 0, 0.0, 200.2142857142857, 104, 332, 113.0, 332.0, 332.0, 332.0, 0.09087073637750301, 0.024492503164248856, 0.05351079495667413], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 37.5, 0.4691164972634871], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 6.25, 0.07818608287724785], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 6.25, 0.07818608287724785], "isController": false}, {"data": ["401/Unauthorized", 8, 50.0, 0.6254886630179828], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1279, 16, "401/Unauthorized", 8, "406/Not Acceptable", 6, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 19, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 174, 6, "401/Unauthorized", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
