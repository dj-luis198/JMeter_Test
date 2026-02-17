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

    var data = {"OkPercent": 65.9966499162479, "KoPercent": 34.003350083752096};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.4919950738916256, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=506496f6-116c-4b01-ac8e-a0066784781a"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.6785714285714286, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6785714285714286, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=036f6b3a-ed45-4fac-831c-2c33c108c064"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/79f66a13-f154-46db-8726-c6db4243fe75"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/036f6b3a-ed45-4fac-831c-2c33c108c064"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d910c3d2-02f5-4e23-ac56-58f4c68d770e"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/5dfefac6-5d19-4e3f-b060-2558a9e6c2a4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5dfefac6-5d19-4e3f-b060-2558a9e6c2a4"], "isController": false}, {"data": [0.6785714285714286, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.43478260869565216, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8214285714285714, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ab89ccaa-e5b2-40b2-9239-7112c4a019bc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d37acd47-36d2-4814-97bc-78060cb98501"], "isController": false}, {"data": [0.0, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/aebc39c0-5195-4cc6-a012-c1e876cdbbac"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c6888bd8-c11f-4558-a001-fbb177ff433b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d9138df4-bed8-4956-9363-812b64eacbb8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9077380952380952, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/d9138df4-bed8-4956-9363-812b64eacbb8"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/eac79702-49f3-4f82-abb0-6a8943627008"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c6888bd8-c11f-4558-a001-fbb177ff433b"], "isController": false}, {"data": [0.7391304347826086, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/68697f36-6efc-4d2c-ab41-1e4e426fb0aa"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e2c47f29-19a3-4e79-8445-de367bd238fd"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ab89ccaa-e5b2-40b2-9239-7112c4a019bc"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=68697f36-6efc-4d2c-ab41-1e4e426fb0aa"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e2c47f29-19a3-4e79-8445-de367bd238fd"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/cdf098de-388b-416a-a2ae-88ca5eab5bc7"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d910c3d2-02f5-4e23-ac56-58f4c68d770e"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=79f66a13-f154-46db-8726-c6db4243fe75"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9523c02d-fc6f-487d-8e32-29119e173f59"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/805eb716-8593-43d8-9cd2-0fc517a89152"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9523c02d-fc6f-487d-8e32-29119e173f59"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/506496f6-116c-4b01-ac8e-a0066784781a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=805eb716-8593-43d8-9cd2-0fc517a89152"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 597, 203, 34.003350083752096, 315.7939698492463, 137, 1868, 155.0, 712.8000000000004, 1069.0000000000005, 1370.9599999999982, 2.348766209240841, 2.4430352885402242, 1.1241979597798377], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 56, 56, 100.0, 824.6964285714286, 578, 1312, 882.0, 1046.9, 1073.6499999999999, 1312.0, 0.2494821018867084, 1.6054710993361994, 0.41880833314770677], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 17, 17, 100.0, 213.76470588235293, 137, 432, 151.0, 430.4, 432.0, 432.0, 0.09317161663716232, 0.046312844597964475, 0.046767784132325615], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 17, 0, 0.0, 203.0, 142, 451, 153.0, 439.0, 451.0, 451.0, 0.10773062274637042, 0.08363852058922314, 0.03829486980437387], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=506496f6-116c-4b01-ac8e-a0066784781a", 1, 0, 0.0, 730.0, 730, 730, 730.0, 730.0, 730.0, 730.0, 1.36986301369863, 0.2474850171232877, 0.9444563356164384], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 15, 15, 100.0, 145.66666666666663, 139, 151, 145.0, 150.4, 151.0, 151.0, 0.12968038108741323, 0.06446026755223958, 0.06509347253801796], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 156.0, 145, 167, 156.0, 167.0, 167.0, 167.0, 1.7482517482517483, 0.5155976835664337, 1.0807064029720281], "isController": false}, {"data": ["https://demoqa.com/books", 56, 56, 100.0, 274.5357142857143, 138, 876, 151.5, 586.6, 611.5999999999999, 876.0, 0.251498888464734, 0.125012631082568, 0.12157416971683921], "isController": false}, {"data": ["deleteBook", 14, 2, 14.285714285714286, 476.64285714285705, 146, 794, 449.0, 757.0, 794.0, 794.0, 0.09144290370409076, 0.018013027347959842, 0.06152750063683451], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, 14.285714285714286, 476.64285714285705, 146, 794, 449.0, 757.0, 794.0, 794.0, 0.09121590805436468, 0.017968312245084113, 0.06137476625923561], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 8, 33.333333333333336, 865.2916666666667, 144, 1467, 970.5, 1321.0, 1442.5, 1467.0, 0.09855170063278405, 0.030797406447745014, 0.04446375555893187], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=036f6b3a-ed45-4fac-831c-2c33c108c064", 1, 0, 0.0, 1097.0, 1097, 1097, 1097.0, 1097.0, 1097.0, 1097.0, 0.9115770282588879, 0.16468920920692798, 0.6284896308113036], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/79f66a13-f154-46db-8726-c6db4243fe75", 3, 0, 0.0, 664.0, 234, 1342, 416.0, 1342.0, 1342.0, 1342.0, 0.037488753373987806, 0.03125283118189543, 0.024040639370688795], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/036f6b3a-ed45-4fac-831c-2c33c108c064", 3, 0, 0.0, 375.3333333333333, 260, 575, 291.0, 575.0, 575.0, 575.0, 0.043346337234503686, 0.027867518241583587, 0.027796967562490973], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d910c3d2-02f5-4e23-ac56-58f4c68d770e", 3, 0, 0.0, 413.33333333333337, 223, 736, 281.0, 736.0, 736.0, 736.0, 0.04174203422846807, 0.026455644740503687, 0.026768166481146514], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5dfefac6-5d19-4e3f-b060-2558a9e6c2a4", 3, 0, 0.0, 378.0, 249, 543, 342.0, 543.0, 543.0, 543.0, 0.02493475406020912, 0.025007805097494888, 0.01599006038366275], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5dfefac6-5d19-4e3f-b060-2558a9e6c2a4", 1, 0, 0.0, 493.0, 493, 493, 493.0, 493.0, 493.0, 493.0, 2.028397565922921, 0.3664585446247465, 1.3984850405679514], "isController": false}, {"data": ["deleteAccount", 14, 2, 14.285714285714286, 444.9285714285715, 143, 736, 465.5, 655.5, 736.0, 736.0, 0.09181592219256422, 0.02073799916709842, 0.061381403340787906], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 0, 0.0, 196.42857142857144, 145, 455, 155.0, 455.0, 455.0, 455.0, 0.062159234198234686, 0.04892611598025112, 0.02209566528140373], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 1175.391304347826, 858, 1868, 1134.0, 1783.2000000000003, 1864.0, 1868.0, 0.0954265775465412, 0.0493907090817059, 0.04389249807072354], "isController": false}, {"data": ["goToProfile", 14, 2, 14.285714285714286, 291.7857142857143, 159, 512, 246.5, 497.0, 512.0, 512.0, 0.09142379500173052, 0.17501636649187308, 0.05799441906708547], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 7, 100.0, 149.14285714285714, 145, 161, 148.0, 161.0, 161.0, 161.0, 0.06198475175106924, 0.03081077992313891, 0.031113439843798427], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ab89ccaa-e5b2-40b2-9239-7112c4a019bc", 3, 0, 0.0, 387.3333333333333, 244, 464, 454.0, 464.0, 464.0, 464.0, 0.017714268843553482, 0.024420549659000326, 0.011359736205013139], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d37acd47-36d2-4814-97bc-78060cb98501", 1, 0, 0.0, 371.0, 371, 371, 371.0, 371.0, 371.0, 371.0, 2.6954177897574128, 0.8607437668463612, 1.6083010444743935], "isController": false}, {"data": ["addBook", 56, 56, 100.0, 857.1428571428572, 580, 1784, 780.5, 1121.2, 1497.6499999999999, 1784.0, 0.26646871847579895, 0.8707305897166866, 0.520005265433773], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/aebc39c0-5195-4cc6-a012-c1e876cdbbac", 1, 0, 0.0, 315.0, 315, 315, 315.0, 315.0, 315.0, 315.0, 3.1746031746031744, 1.013764880952381, 1.8942212301587302], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c6888bd8-c11f-4558-a001-fbb177ff433b", 1, 0, 0.0, 870.0, 870, 870, 870.0, 870.0, 870.0, 870.0, 1.1494252873563218, 0.20765984195402298, 0.7924748563218391], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d9138df4-bed8-4956-9363-812b64eacbb8", 1, 0, 0.0, 430.0, 430, 430, 430.0, 430.0, 430.0, 430.0, 2.3255813953488373, 0.42014898255813954, 1.6033793604651163], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 15, 0, 0.0, 209.66666666666666, 144, 450, 152.0, 441.0, 450.0, 450.0, 0.13641944431813016, 0.10191491689782184, 0.04849284934746032], "isController": false}, {"data": ["deleteBooks", 14, 2, 14.285714285714286, 549.357142857143, 145, 1097, 483.5, 983.5, 1097.0, 1097.0, 0.09138679460817913, 0.018001974607526356, 0.06207621413884266], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books", 168, 12, 7.142857142857143, 227.22023809523813, 138, 1314, 154.5, 420.9, 475.8499999999999, 1143.5700000000006, 0.6929663911300302, 1.5319241147663714, 0.3307614238912538], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 6, 0, 0.0, 151.16666666666666, 147, 154, 151.5, 154.0, 154.0, 154.0, 0.03212989043707361, 0.024881838981054075, 0.01142117199130351], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d9138df4-bed8-4956-9363-812b64eacbb8", 3, 0, 0.0, 826.0, 217, 1747, 514.0, 1747.0, 1747.0, 1747.0, 0.04437016550071732, 0.028525741166639553, 0.028453524100394895], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 15, 15, 100.0, 183.93333333333334, 141, 433, 145.0, 432.4, 433.0, 433.0, 0.07273326771176292, 0.03615354811063215, 0.03650869101938099], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/eac79702-49f3-4f82-abb0-6a8943627008", 1, 0, 0.0, 281.0, 281, 281, 281.0, 281.0, 281.0, 281.0, 3.558718861209964, 1.1364268238434163, 2.123415258007117], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 15, 0, 0.0, 172.6, 141, 516, 147.0, 300.0000000000001, 516.0, 516.0, 0.0775478340889939, 0.06293188489058, 0.027565831648822047], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c6888bd8-c11f-4558-a001-fbb177ff433b", 3, 0, 0.0, 499.6666666666667, 241, 868, 390.0, 868.0, 868.0, 868.0, 0.02787560048689382, 0.02795726728519527, 0.017875954739316677], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 542.0869565217391, 146, 1272, 588.0, 778.2000000000002, 1179.7999999999988, 1272.0, 0.09781490018627359, 0.060083566618326256, 0.044226854283442064], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/68697f36-6efc-4d2c-ab41-1e4e426fb0aa", 3, 0, 0.0, 327.3333333333333, 232, 510, 240.0, 510.0, 510.0, 510.0, 0.03125683743318851, 0.03134841019910605, 0.020044260984173622], "isController": false}, {"data": ["login", 23, 7, 30.434782608695652, 2126.1304347826085, 1551, 3300, 1998.0, 2750.2000000000003, 3195.7999999999984, 3300.0, 0.09474417014405233, 0.14261507812274726, 0.14193523077414227], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/e2c47f29-19a3-4e79-8445-de367bd238fd", 3, 0, 0.0, 618.3333333333334, 467, 906, 482.0, 906.0, 906.0, 906.0, 0.023249505947998607, 0.023317619734955632, 0.014909351145038168], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 6, 6, 100.0, 196.0, 146, 433, 149.5, 433.0, 433.0, 433.0, 0.031353204297479204, 0.015584747058024331, 0.015737838875883117], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 17, 0, 0.0, 214.47058823529412, 141, 435, 148.0, 431.8, 435.0, 435.0, 0.0914229170363917, 0.0740132795148132, 0.03249799004027986], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ab89ccaa-e5b2-40b2-9239-7112c4a019bc", 1, 0, 0.0, 458.0, 458, 458, 458.0, 458.0, 458.0, 458.0, 2.1834061135371177, 0.39446301855895194, 1.5053561681222707], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=68697f36-6efc-4d2c-ab41-1e4e426fb0aa", 1, 0, 0.0, 662.0, 662, 662, 662.0, 662.0, 662.0, 662.0, 1.5105740181268883, 0.27290643882175225, 1.0414699773413896], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 17, 17, 100.0, 163.82352941176467, 140, 428, 148.0, 209.5999999999998, 428.0, 428.0, 0.11053172260438746, 0.05494203789612619, 0.055481743572905425], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e2c47f29-19a3-4e79-8445-de367bd238fd", 1, 0, 0.0, 450.0, 450, 450, 450.0, 450.0, 450.0, 450.0, 2.2222222222222223, 0.4014756944444444, 1.5321180555555556], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 15, 0, 0.0, 171.86666666666667, 143, 488, 146.0, 294.2000000000001, 488.0, 488.0, 0.07499175090740018, 0.06217577785193629, 0.02665722395536491], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 20, 20, 100.0, 162.64999999999998, 139, 419, 151.0, 161.9, 406.1499999999998, 419.0, 0.09366891784299217, 0.04656003826375294, 0.04701740602665817], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cdf098de-388b-416a-a2ae-88ca5eab5bc7", 1, 0, 0.0, 322.0, 322, 322, 322.0, 322.0, 322.0, 322.0, 3.105590062111801, 0.9917265139751552, 1.8530425077639752], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d910c3d2-02f5-4e23-ac56-58f4c68d770e", 1, 0, 0.0, 546.0, 546, 546, 546.0, 546.0, 546.0, 546.0, 1.8315018315018314, 0.3308865613553113, 1.262734661172161], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=79f66a13-f154-46db-8726-c6db4243fe75", 1, 0, 0.0, 711.0, 711, 711, 711.0, 711.0, 711.0, 711.0, 1.4064697609001406, 0.25409854078762306, 0.9696949718706048], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 20, 0, 0.0, 178.85000000000002, 140, 459, 150.0, 413.1000000000006, 458.09999999999997, 459.0, 0.09223645738214487, 0.07160935900273942, 0.03278717821005931], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9523c02d-fc6f-487d-8e32-29119e173f59", 1, 0, 0.0, 474.0, 474, 474, 474.0, 474.0, 474.0, 474.0, 2.109704641350211, 0.3811478111814346, 1.4545424578059072], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 15, 15, 100.0, 168.79999999999998, 138, 450, 148.0, 277.2000000000001, 450.0, 450.0, 0.08113458605134197, 0.040329594043098695, 0.040725759014052516], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/805eb716-8593-43d8-9cd2-0fc517a89152", 3, 0, 0.0, 393.6666666666667, 225, 512, 444.0, 512.0, 512.0, 512.0, 0.0549068413924375, 0.035299808512390646, 0.03521044190856181], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 11, 11, 100.0, 176.36363636363637, 141, 432, 150.0, 378.20000000000016, 432.0, 432.0, 0.11497977401248054, 0.05715303219956308, 0.06527837844547346], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9523c02d-fc6f-487d-8e32-29119e173f59", 3, 0, 0.0, 302.0, 239, 396, 271.0, 396.0, 396.0, 396.0, 0.03499644202839378, 0.02844600121904273, 0.022442379816385333], "isController": false}, {"data": ["register", 24, 8, 33.333333333333336, 865.2916666666667, 144, 1467, 970.5, 1321.0, 1442.5, 1467.0, 0.09862865080115231, 0.0308214533753601, 0.04449847331067614], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/506496f6-116c-4b01-ac8e-a0066784781a", 3, 0, 0.0, 309.6666666666667, 216, 473, 240.0, 473.0, 473.0, 473.0, 0.028080159495305936, 0.028162425587577335, 0.018007133530518454], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=805eb716-8593-43d8-9cd2-0fc517a89152", 1, 0, 0.0, 458.0, 458, 458, 458.0, 458.0, 458.0, 458.0, 2.1834061135371177, 0.39446301855895194, 1.5053561681222707], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 8, 3.9408866995073892, 1.340033500837521], "isController": false}, {"data": ["401/Unauthorized", 16, 7.8817733990147785, 2.680067001675042], "isController": false}, {"data": ["404/Not Found", 179, 88.17733990147784, 29.98324958123953], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 597, 203, "404/Not Found", 179, "401/Unauthorized", 16, "406/Not Acceptable", 8, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 17, 17, "404/Not Found", 17, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 15, 15, "404/Not Found", 15, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/books", 56, 56, "404/Not Found", 56, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 8, "406/Not Acceptable", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 7, "404/Not Found", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 168, 12, "401/Unauthorized", 12, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 15, 15, "404/Not Found", 15, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 6, 6, "404/Not Found", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 17, 17, "404/Not Found", 17, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 20, 20, "404/Not Found", 20, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 15, 15, "404/Not Found", 15, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 11, 11, "404/Not Found", 11, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
